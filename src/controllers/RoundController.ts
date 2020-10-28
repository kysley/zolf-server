import { testCourse } from '../stubs';
import { Hail } from '../entities/weather/Hail';
import { Player, Round } from '../types';

export class RoundController implements Round {
  course = testCourse;
  players;
  weather = new Hail();

  constructor({ players }: { players: Player[] }) {
    this.players = players;
  }

  start() {
    this.players.forEach(async (player) => player.swing());
  }
}
