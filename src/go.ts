import dotenv from 'dotenv';
dotenv.config();
import { Person } from './entities/Player';
import { RoundController } from './controllers/RoundController';
import { testCourse } from './stubs';
import { golfer } from './redis/golfer';
import { Player } from './types';

export const players: Person[] = [];

for (let i = 0; i < 4; i++) {
  players.push(
    new Person({
      name: `Player${i}`,
      id: String(i),
      course: testCourse,
    } as Player)
  );
}

const controller = new RoundController(players);


async function t() {
  golfer.set('a', ['name', 'evan2', 'age', 35]);
  golfer.set('b', 'food', 'ass');

  // Here you will see that each player SHOULD start sequentially (0 => 3)
  // but because we have each player playing in their own worker thread
  // each time the app is run you'll see that each player finishes at a
  // different time, semi simulating the pace of each player
  //
  // NOTE: Time taken for each player isn't determined by how it prints to console
  // check the execution time log at the end of each players round
  players.forEach(async (player: Player) => {
    await controller.start(player);
  });
}

t();
