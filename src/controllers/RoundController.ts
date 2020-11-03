import { testCourse } from '../stubs';
import { Hail } from '../entities/weather/Hail';
import { Player, Round } from '../types';
import { shuffle, chunk } from '../utils';

export class RoundController implements Round {
  course = testCourse;
  players: Array<Player>;
  weather = new Hail();
  groups: Array<Array<Player>> = [];
  hole = 1;

  constructor(players: Array<Player>) {
    this.players = players;
    this.groupPlayers();
    this.playGroups();
  }

  groupPlayers() {
    let players = shuffle(this.players);
    this.groups = chunk(players, 4);
  }

  get orderedGroups() {
    const ret: Array<Array<Player>> = [];
    const hole = this.hole === 1 ? 1 : this.hole - 1;
    this.groups.forEach((group) => {
      ret.push(group.sort((a, b) => a.scoreCard[hole] - b.scoreCard[hole]));
    });
    return ret;
  }

  proceed() {
    this.hole++;
    this.playGroups();
  }

  async playGroups() {
    const groups = this.orderedGroups;
    for (let g = 0; g < groups.length; g++) {
      for (let p = 0; p < groups[g].length; p++) {
        const player = groups[g][p];
        await player.swing();
      }
    }
  }

  // public start(player: Player) {
  //   // TODO: This can be modularized/refactored to be a bit cleaner
  //   return new Promise((resolve, reject) => {
  //     const worker = new Worker('./src/services/worker.js', {
  //       workerData: { path: '../services/worker.ts' },
  //     });
  //     worker.on('message', (resolve) => {
  //       player.swing();
  //     });
  //     worker.on('error', reject);
  //     worker.on('exit', (code) => {
  //       if (code !== 0)
  //         reject(new Error(`Worker stopped with exit code ${code}`));
  //     });
  //   }).catch((error) => console.log(error));
  // }
}
