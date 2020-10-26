import { Person } from './entities/Player';
import { RoundController } from './controllers/RoundController';
import { testCourse } from './stubs';

export const players: Person[] = [];

for (let i = 0; i < 5; i++) {
  players.push(
    new Person({
      name: `Player${i}`,
      id: String(i),
      course: testCourse,
    } as Player)
  );
}

const controller = new RoundController({ players });

controller.start();
