import produce from 'immer';

class Hail implements WeatherEffect {
  name = 'Hail';

  roll() {
    const roll = Math.random() * 100;
    if (roll < 5) return true;
    return false;
  }

  effect({ player }: { player: Player }) {
    const event: EventMessage = {
      info: {
        name: 'Hail Storm',
        happening: `Well Jim, ${player.name}'s ball was hit by stray hail!`,
        triggeredBy: 'Hail',
      },
    };
    return event;
  }
}

export { Hail };
