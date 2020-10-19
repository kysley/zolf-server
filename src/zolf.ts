import { ed, getClubFromDistanceToHole } from './utils';

function guessProficiency(): ClubProficiency {
  return {
    '3': Math.random(),
    '4': Math.random(),
    '5': Math.random(),
    '6': Math.random(),
    '7': Math.random(),
    '8': Math.random(),
    '9': Math.random(),
    D: Math.random(),
    P: Math.random(),
    PW: Math.random(),
  };
}
export class Person implements Player {
  stats = {
    control: Math.random(),
    patience: Math.random(),
    brainSize: Math.random(),
    tilt: Math.random(),
    alive: true,
    proficiency: guessProficiency(),
  };
  hole;
  id;
  name;
  scoreCard;
  afflictions;
  lie;
  strokes;

  constructor({
    stats,
    afflictions,
    hole,
    id,
    lie,
    name,
    scoreCard,
    strokes,
  }: PlayerConstructor) {
    this.stats = stats;
    this.hole = hole;
    this.id = id;
    this.name = name;
    this.scoreCard = scoreCard;
    this.afflictions = afflictions;
    this.lie = lie;
    this.strokes = strokes;
  }

  rollBrainSize() {
    // Number from 1 - 20 to add or subtract to the distance
    const brainSizeDistanceModifier = Math.floor(Math.random() * 20);
    // 50/50 chance to add or remove the distance mod. (Club up or club down)
    const addOrRemoveDistance =
      Math.random() > 0.5
        ? -brainSizeDistanceModifier
        : brainSizeDistanceModifier;
    return addOrRemoveDistance;
  }

  rollControl() {
    // todo: we should apply Mental here
    const controlRoll = Math.random();
    if (controlRoll > this.stats.control) {
      const controlDelta = controlRoll - this.stats.control;
      const slicePercent = 1 - ed(controlDelta);
      return slicePercent;
    }
    return false;
  }

  advanceToNextHole() {}

  swing(environment: Environment, lie: Lie) {
    // The club the player should hit based off of distance
    const idealClub = getClubFromDistanceToHole(lie.distanceToHole);
    let playersClub = idealClub;

    const brainSizeClub = getClubFromDistanceToHole(
      lie.distanceToHole + this.rollBrainSize()
    );

    playersClub = brainSizeClub;

    const isOnGreen = playersClub === 'P' ? true : false;

    let shotDistance = this.stats.proficiency[playersClub];

    const didControlRoll = this.rollControl();
    if (didControlRoll) {
      shotDistance *= didControlRoll;
      // get shotDistance delta to figure out slice distance
    }

    // todo: Apply Weather effects here

    if (isOnGreen) {
      // apply finesse for putting
    }

    // use slice distance (as inaccuracy) to determine the new lie
    this.proceedToNextShot({ shotDistance, inaccuracy: 0 });
  }

  // todo: determine the new lie using inaccuracy
  proceedToNextShot({
    shotDistance,
    inaccuracy,
  }: {
    shotDistance: number;
    inaccuracy: number;
  }) {
    this.strokes += 1;
    this.lie.distanceToHole -= shotDistance;
  }

  proceedToNextHole() {
    this.scoreCard.push(this.strokes);
    this.hole += 1;
    this.strokes = 0;
    this.lie.condition = 'Teebox';
  }
}
