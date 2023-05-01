import produce from 'immer';
import {WeatherEffect, Weather, EventMessage} from '../../types';
import {GolfPlayer} from '../Player';

class Hail implements WeatherEffect {
  name = 'Hail';

  roll() {
    const roll = Math.random() * 100;
    if (roll < 5) return true;
    return false;
  }

  effect({player}: {player: GolfPlayer}) {
    const event: EventMessage = {
      info: {
        name: 'Hail Storm',
        happening: `Well Jim, ${player.name}'s ball was hit by stray hail!`,
        triggeredBy: Weather.Hail,
      },
    };
    return event;
  }
}

export {Hail};
