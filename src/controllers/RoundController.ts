import events from 'events';

import { testCourse } from '../stubs';
import { Hail } from '../entities/weather/Hail';
import { Player, Round } from '../types';
import { shuffle, chunk, sleep } from '../utils';

const pE = new events.EventEmitter();
const gE = new events.EventEmitter();

const PLAYERS_PER_GROUP = 4;

export class GroupController {
  players: Array<Player>;
  hole = 1;
  id: string;
  playersDone = 0;
  state: 'PLAYING' | 'WALKING' | 'WAITING' = 'WAITING';

  constructor(group: any) {
    this.players = group.players;
    this.id = group.id;
  }

  get teeOffOrder() {
    const hole = this.hole === 1 ? 1 : this.hole - 1;
    return this.players.sort((a, b) => a.scoreCard[hole] - b.scoreCard[hole]);
  }

  async playHole() {
    const order = this.teeOffOrder;
    this.state = 'PLAYING';

    for (let i = 0; i < order.length; i++) {
      const player = this.players[i];
      await player.swing();
      if (player.done) {
        this.playersDone++;
      } else {
        await player.proceedToNextShot();
      }
    }
    if (this.playersDone === this.players.length) {
      this.nextHole();
    }
  }

  async nextHole() {
    gE.emit('group.hole.finished', { id: this.id });
    this.state = 'WALKING';
    await sleep(30000);
  }
}

export class RoundController implements Round {
  course = testCourse;
  players: Array<Player>;
  weather = new Hail();
  groups: Array<GroupController> = [];
  // hole = 1;
  leadersHole = 1;

  constructor(players: Array<Player>) {
    this.players = players;
    this.groupPlayers();

    gE.on('group.hole.start', () => {});
    gE.on('group.hole.complete', (...args) => {
      this.rake(args);
    });
  }

  rake(...args: any[]) {
    if (args.hole > this.leadersHole) {
      const delta = args.hole - this.leadersHole;
      this.leadersHole = args.hole;

      for (let i = 0; i < delta; i++) {
        this.groups.forEach((group) => {
          if (group.state === 'WAITING') {
          }
        });
      }
    }
  }

  groupPlayers() {
    let players = shuffle(this.players);
    const groups = chunk(players, PLAYERS_PER_GROUP);
    this.groups = groups.reduce((acc, cur) => {
      acc.push(new GroupController(cur));
      return acc;
    }, []);
  }

  startRound() {
    this.groups[0].start();
  }

  teeOffGroup(groupNumber: number) {
    this.groups[groupNumber].start();
  }

  // get teeOffGroups() {
  //   const ret: any = [];
  //   const hole = this.hole === 1 ? 1 : this.hole - 1;
  //   this.groups.forEach((group) => {
  //     ret.push(group.sort((a, b) => a.scoreCard[hole] - b.scoreCard[hole]));
  //   });
  //   return ret;
  // }

  // get swingGroups() {
  //   const ret: Array<Array<Player>> = [];
  //   this.groups.forEach((group) => {
  //     ret.push(
  //       group.sort((a, b) => a.lie.distanceToHole - b.lie.distanceToHole)
  //     );
  //   });
  //   return ret;
  // }

  // proceed() {
  //   this.hole++;
  //   // this.playGroups();
  // }

  async teeOff() {
    // const groups = this.teeOffGroups;
    // this.groups[0]
  }

  // async play() {
  //   const groups = this.swingGroups;
  //   for (let g = 0; g < groups.length; g++) {
  //     let isGroupDone = true;
  //     for (let p = 0; p < groups[g].length; p++) {
  //       const player = groups[g][p];
  //       if (!player.done) {
  //         await player.swing();
  //         isGroupDone = false;
  //       }
  //     }
  //     if (isGroupDone) {
  //     }
  //   }
  // }

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
