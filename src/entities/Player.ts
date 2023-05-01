import {
  Affliction,
  ClubProficiency,
  Club,
  Course,
  Hole,
  Lie,
  Lies,
  Stats,
  Weather,
} from '../types';
import {randomUUID} from 'crypto';
import {c, clubDistances, ed, sleep} from '../utils';

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
class CurrentLie implements Lie {
  public condition: Lies;
  public distanceToHole: number;

  constructor(condition: Lies, distanceToHole: number) {
    this.condition = condition;
    this.distanceToHole = distanceToHole;
  }
}

export class GolfPlayer {
  id;
  name;
  lie?: CurrentLie;
  hole;
  strength = 0.87;
  flair = 1;
  mindset = 0.75;

  puts = 0;

  constructor(name: string) {
    this.name = name;
    this.id = randomUUID();
    this.hole = 1;
    this.lie = undefined;
  }

  calculateShotDistance(
    maxDistance: number,
    pinDistance: number,
    club: Club,
  ): number {
    const chance = Math.random();

    // The player doesnt try to over shoot the ball. normally.
    const maxPower = this.strength * pinDistance;
    //
    const powerLevel = Math.random() * (1 - this.strength) + this.strength;

    // reduce accuracy for green shots and attacks
    let accuracyFactor = club === Club.AW || club === Club.P ? 0.75 : 1;

    // adjust accuracy based on pin distance
    accuracyFactor -= (pinDistance / maxDistance) * 0.1;

    // ensure minimum accuracy factor
    accuracyFactor = Math.max(0.1, accuracyFactor);

    const distance = powerLevel * maxPower * accuracyFactor;

    if (this.lie?.condition === Lies.Green) {
      // Higher distance to pin reduces the probability of putt going in
      const probabilityOfPuttGoingIn = 1 - pinDistance / 100;

      if (chance < probabilityOfPuttGoingIn) {
        return pinDistance;
      }
      return Math.round(pinDistance * chance);
    }

    return Math.round(Math.min(distance, maxDistance));
  }

  async playHole(hole: Hole, weather?: Weather): Promise<void> {
    this.lie = new CurrentLie(Lies.Teebox, hole.yardage);
    let completed = false;
    let shotCount = 1;
    this.puts = 0;

    while (!completed) {
      const idealClub = c(this.lie.distanceToHole, this.lie.condition);

      const shotDistance = this.calculateShotDistance(
        clubDistances[idealClub][1],
        this.lie.distanceToHole,
        idealClub,
      );

      if (idealClub === Club.P) {
        this.puts += 1;
      }
      if (shotDistance === this.lie.distanceToHole) {
        console.log(
          `${this.name} (shot #${shotCount} par${hole.par}, ${idealClub}), went ${shotDistance}(${this.lie.distanceToHole})yds, in ${this.lie.condition}. HOLE ${this.hole} COMPLETED IN ${this.puts} PUTS FOR ${shotCount} SHOTS`,
        );
        this.lie.distanceToHole = 0;
        this.puts = 0;
        completed = true;
      } else {
        // instead of a negative distance, simulate that the ball is on the other side of the hole
        if (shotDistance > this.lie.distanceToHole) {
          const overshootYardage = shotDistance - this.lie.distanceToHole;
          this.lie.distanceToHole = overshootYardage;
        } else {
          this.lie.distanceToHole -= shotDistance;
        }
        // todo: calculate
        const inaccuracy = Math.random();

        // Manually ensure the lie is set to Green if the distance to the hole is less than the putters upper bound distance
        if (this.lie.distanceToHole < clubDistances['P'][1]) {
          // if (inaccuracy < 0.7) {
          // this.lie.condition = Lies.Bunker;
          // } else {
          this.lie.condition = Lies.Green;
          // }
        } else if (inaccuracy < 0.7) this.lie.condition = Lies.Fairway;
        else if (inaccuracy > 0.7 && inaccuracy < 0.9)
          this.lie.condition = Lies.Rough;
        else if (inaccuracy > 0.9) this.lie.condition = Lies['Heavy Rough'];

        console.log(
          `${this.name} (shot #${shotCount}, ${idealClub}), shot went ${shotDistance}yds, in ${this.lie.condition}. ${this.lie.distanceToHole}yds remain`,
        );
        shotCount += 1;
        await sleep((Math.random() * (5 - 3 + 1) + 3) * 1000); // 0-3 seconds
      }
    }
    this.hole += 1;
  }
}
