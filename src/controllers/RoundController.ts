import { testCourse } from '../stubs';
import { Hail } from '../entities/weather/Hail';
import { Player, Round } from '../types';
import { Worker } from 'worker_threads';

export class RoundController implements Round {
  course = testCourse;
  players: Array<Player>;
  weather = new Hail();

  constructor(players: Array<Player>) {
    this.players = players;
  }

  public start(player: Player) {
    // TODO: This can be modularized/refactored to be a bit cleaner
    return new Promise((resolve, reject) => {
      const worker = new Worker('./src/services/worker.js', { workerData: { path: '../services/worker.ts' } });
      worker.on('message', resolve => { player.swing() });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    }).catch(error => console.log(error));
  }
}
