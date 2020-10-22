import { testCourse } from './stubs';
import { Hail } from './weather/Hail';

export class RoundController implements Round {
  course = testCourse;
  players;
  weather = new Hail();

  constructor({ players }: { players: Player[] }) {
    this.players = players;
  }

  start() {
    this.players.forEach(async (player) => await player.swing());
  }
}
