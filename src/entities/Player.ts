import {
  Affliction,
  ClubProficiency,
  Clubs,
  Course,
  Lie,
  Lies,
  Player,
  Stats,
} from '../types';
import { c, clubDistances, ed, sleep } from '../utils';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * (max - min + 1) + min; //The maximum is inclusive and the minimum is inclusive
}

function guessProficiency(): ClubProficiency {
  return {
    '3I': getRandomIntInclusive(0.75, 0.99),
    '4I': getRandomIntInclusive(0.75, 0.99),
    '5I': getRandomIntInclusive(0.75, 0.99),
    '6I': getRandomIntInclusive(0.75, 0.99),
    '7I': getRandomIntInclusive(0.75, 0.99),
    '8I': getRandomIntInclusive(0.75, 0.99),
    '9I': getRandomIntInclusive(0.75, 0.99),
    D: getRandomIntInclusive(0.75, 0.99),
    P: getRandomIntInclusive(0.75, 0.99),
    PW: getRandomIntInclusive(0.75, 0.99),
    AW: getRandomIntInclusive(0.75, 0.99),
  };
}

class PlayerStats implements Stats {
  // We can keep these all non optional since
  // they are always being initialized
  public control: number;
  public patience: number;
  public brainSize: number;
  public tilt: number;
  public alive: boolean;
  public proficiency: ClubProficiency;

  constructor(stats: Stats) {
    this.control = stats.control;
    this.patience = stats.patience;
    this.brainSize = stats.brainSize;
    this.tilt = stats.tilt;
    this.alive = stats.alive;
    this.proficiency = stats.proficiency;
  }
}

class CurrentLie implements Lie {
  public condition: Lies;
  public distanceToHole: number;

  constructor(condition: Lies, distanceToHole: number) {
    this.condition = condition;
    this.distanceToHole = distanceToHole;
  }
}

export class Person implements Player {
  // TODO: Not sure if these need to be private or not
  public id: string;
  public name: string;
  public hole: number;
  public course: Course;

  public scoreCard: Array<number>;
  public afflictions?: Array<Affliction>;
  public strokes: number;
  public stats: PlayerStats;
  public lie: Lie;

  // Execution timers - measures the execution time of each player
  private startTime!: any; // Should be type => NodeJS.HRTime but didn't want to deal with TS errors on assignment (line 138)
  private endTime!: any; // Should be type => NodeJS.HRTime but didn't want to deal with TS errors on assignment (line 238)

  constructor(player: Player) {
    this.stats = player.stats || this.generatePlayerStats();
    this.hole = player.hole ?? 1;
    this.id = player.id;
    this.name = player.name;
    this.scoreCard = player.scoreCard || [];
    this.afflictions = player.afflictions;
    this.course = player.course;
    this.lie = player.lie || this.setFirstLie(this.course);
    this.strokes = player.strokes ?? 0;
  }

  private generatePlayerStats(): PlayerStats {
    return new PlayerStats({
      control: Math.random(),
      patience: Math.random(),
      brainSize: Math.random(),
      tilt: Math.random(),
      alive: true,
      proficiency: guessProficiency(),
    });
  }

  private setFirstLie(course: Course): Lie {
    return new CurrentLie(Lies.Teebox, course.holes[0].yardage);
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

  // refactor: we could return the slice percent, new shot distance, and slice distance in here
  // instead of below
  rollControl() {
    // todo: we should apply Mental here
    const controlRoll = Math.random();
    if (this.stats) {
      if (controlRoll > this.stats.control) {
        const controlDelta = controlRoll - this.stats.control;
        const slicePercent = 1 - ed(controlDelta);
        return slicePercent;
      }
    }
    return false;
  }

  async swing() {
    if (this.hole == 1) {
      this.startTime = process.hrtime();
    }
    // The club the player should hit based off of distance
    // const idealClub = getClubFromDistanceToHole(this.lie.distanceToHole);
    let playersClub: Clubs;

    if (this.lie && this.stats) {
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
        this.stats.proficiency[playersClub] * clubDistances[playersClub][0]; // This sometimes has unexpected behaviour -> undefined

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
          console.log(`${this.name} sunk a putt.`);
          this.proceedToNextHole();
          return;
        } else {
          shotDistance =
            this.lie.distanceToHole - Math.floor((Math.random() + 1) * 3); // 1-3 yds
        }
      }

      this.proceedToNextShot({ shotDistance, inaccuracy });
    } else {
      console.log(this.lie, this.stats);
    }
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
      this.lie.condition = Lies.Green;
    else if (inaccuracy === 0) this.lie.condition = Lies.Fairway;
    else if (inaccuracy > 10 && inaccuracy < 20)
      this.lie.condition = Lies.Rough;
    else if (inaccuracy > 20) this.lie.condition = Lies['Heavy Rough'];

    console.log(
      `${this.name} (shot #${this.strokes}), ${shotDistance}yds, in ${this.lie.condition}. ${this.lie.distanceToHole}yds remain`
    );
    await sleep((Math.random() * (5 - 3 + 1) + 3) * 1000); // 0-3 seconds
    // this.swing();
  }

  async proceedToNextHole() {
    this.scoreCard.push(this.strokes + 1); // account for the shot that sunk the ball
    this.hole += 1;

    // Do not proceed if it is the end of the round
    // TODO: refactor with finished callback?
    if (this.hole > 18) {
      console.log(
        `${this.name} finished the round, He shot a ${this.strokes + 1}`
      );
      this.endTime = process.hrtime(this.startTime);
      console.log(
        'Execution time: %ds %dms',
        this.endTime[0],
        this.endTime[1] / 1000000
      );
      return;
    }

    console.log(
      `${this.name} is walking to the next hole, hole ${this.hole}. He shot a ${
        this.strokes + 1
      }`
    );

    this.strokes = 0;
    this.lie.condition = Lies.Teebox;
    this.lie.distanceToHole = this.course.holes[this.hole].yardage;
    // this.swing();
  }

  start() {
    this.swing();
  }
}
