import { players } from './go';
import { c, clubDistances, ed, sleep } from './utils';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * (max - min + 1) + min; //The maximum is inclusive and the minimum is inclusive
}

function guessProficiency(): ClubProficiency {
  return {
    '3': getRandomIntInclusive(0.75, 0.99),
    '4': getRandomIntInclusive(0.75, 0.99),
    '5': getRandomIntInclusive(0.75, 0.99),
    '6': getRandomIntInclusive(0.75, 0.99),
    '7': getRandomIntInclusive(0.75, 0.99),
    '8': getRandomIntInclusive(0.75, 0.99),
    '9': getRandomIntInclusive(0.75, 0.99),
    D: getRandomIntInclusive(0.75, 0.99),
    P: getRandomIntInclusive(0.75, 0.99),
    PW: getRandomIntInclusive(0.75, 0.99),
    AW: getRandomIntInclusive(0.75, 0.99),
  };
}
export class Person implements Player {
  // todo: figure out a better way to type this constructor
  constructor({
    stats,
    afflictions = [],
    hole = 1,
    id,
    lie,
    name,
    scoreCard = [],
    strokes = 0,
    course,
  }: Partial<Player>) {
    this.stats =
      stats ||
      ({
        control: Math.random(),
        patience: Math.random(),
        brainSize: Math.random(),
        tilt: Math.random(),
        alive: true,
        proficiency: guessProficiency(),
      } as Player['stats']);
    this.hole = hole;
    this.id = id!;
    this.name = name!;
    this.scoreCard = scoreCard;
    this.afflictions = afflictions;
    this.course = course!;
    this.lie =
      lie ||
      ({
        distanceToHole: this.course.holes[0].yardage,
        condition: 'Teebox',
      } as Lie);
    this.strokes = strokes;
  }
  stats;
  hole;
  id;
  name;
  scoreCard;
  afflictions;
  course;
  lie;
  strokes;

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

  // refactor: we could return the slice percent, new shot distance, and slice distance in here
  // instead of below
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

  swing() {
    // The club the player should hit based off of distance
    // const idealClub = getClubFromDistanceToHole(this.lie.distanceToHole);
    let playersClub: Clubs;
    const idealClub = c(this.lie.distanceToHole, this.lie.condition);

    const brainSizeClub = c(
      this.lie.distanceToHole + this.rollBrainSize(),
      this.lie.condition
    );

    // If the ideal club is a Putter, we want to hit the putter
    playersClub = idealClub === 'P' ? idealClub : brainSizeClub;

    const isOnGreen = playersClub === 'P';

    // todo: Apply Weather effects here

    console.log(`${this.name} is hitting their ${playersClub}`);

    // Use proficiency as a percentage for how far the shot will go. Based on the lower bound of the club's distance
    let shotDistance =
      this.stats.proficiency[playersClub] * clubDistances[playersClub][0];

    // The distance of the slice
    let inaccuracy = 0;

    const didControlRoll = this.rollControl();
    // player rolls control, adjust shot distance.
    // The player can't slice a putt
    if (didControlRoll && !isOnGreen) {
      inaccuracy = shotDistance * didControlRoll;
      console.log(`${this.name} sliced, losing ${inaccuracy}yds`);
      shotDistance -= inaccuracy;
    }
    if (isOnGreen) {
      console.log(`${this.name} is on the green`);
      inaccuracy = -1;
      const didRollFinesse = Math.random() > 0.45;
      if (didRollFinesse) {
        shotDistance = this.lie.distanceToHole;
        this.proceedToNextHole();

        console.log(`${this.name} sunk a putt.`);
        return;
      } else {
        shotDistance =
          this.lie.distanceToHole - Math.floor((Math.random() + 1) * 3); // 1-3 yds
      }
    }

    this.proceedToNextShot({ shotDistance, inaccuracy });
  }

  // todo: determine the new lie using inaccuracy
  async proceedToNextShot({
    shotDistance,
    inaccuracy = 0,
  }: {
    shotDistance: number;
    inaccuracy?: number;
  }) {
    // instead of a negative distance, simulate that the ball is on the other side of the hole
    if (shotDistance > this.lie.distanceToHole) {
      const overshootYardage = shotDistance - this.lie.distanceToHole;
      this.lie.distanceToHole = overshootYardage;
    } else {
      this.lie.distanceToHole -= shotDistance;
    }
    this.strokes += 1;

    // Manually ensure the lie is set to Green if the distance to the hole is less than the putters upper bound distance
    if (inaccuracy === -1 || this.lie.distanceToHole < clubDistances['P'][1])
      this.lie.condition = 'Green';
    else if (inaccuracy === 0) this.lie.condition = 'Fairway';
    else if (inaccuracy > 10 && inaccuracy < 20) this.lie.condition = 'Rough';
    else if (inaccuracy > 20) this.lie.condition = 'Heavy Rough';

    console.log(
      `${this.name} (shot #${this.strokes}), ${shotDistance}yds, in ${this.lie.condition}. ${this.lie.distanceToHole}yds remain`
    );
    // await sleep((Math.random() * (5 - 3 + 1) + 3) * 1000); // 0-3 seconds
    this.swing();
  }

  async proceedToNextHole() {
    console.log(
      `${this.name} is walking to the next hole, hole ${this.hole}. He shot a ${
        this.strokes + 1
      }`
    );
    this.scoreCard.push(this.strokes + 1); // account for the shot that sunk the ball
    this.hole += 1;
    this.strokes = 0;
    this.lie.condition = 'Teebox';

    await sleep((Math.random() + 1 * 5) * 1000);
  }

  start() {
    this.swing();
  }
}
