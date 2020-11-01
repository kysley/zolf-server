import dotenv from 'dotenv';
dotenv.config();
import { Person } from './entities/Player';
import { RoundController } from './controllers/RoundController';
import { testCourse } from './stubs';
import { golfer } from './redis/golfer';

export const players: Person[] = [];

for (let i = 0; i < 1; i++) {
  players.push(
    new Person({
      name: `Player${i}`,
      id: String(i),
      course: testCourse,
    } as Player)
  );
}

const controller = new RoundController({ players });

// controller.start();

golfer.set('a', ['name', 'evan2', 'age', 35]);
golfer.set('b', 'food', 'ass');
async function t() {
  console.log(await golfer.get('a'));
}

t();
