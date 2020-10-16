type Environment = {
  weather: WeatherEffect;
};

type Lie = {
  shot: number;
  lay: 'Rough' | 'Fescue' | 'Heavy Rough' | 'Fairway' | 'Teebox';
  distanceToHole: number;
};

interface Player {
  control: number;
  patience: number;
  brainSize: number;
  tilt: number;
  alive: boolean;
  swing(environment: Environment, lie: Lie): void;
}

type PlayerConstructor = Exclude<Player, 'alive'>;

type WeatherEffect = {
  name: string;
  roll: () => boolean;
  effect: () => any;
};

class Person implements Player {
  control;
  patience;
  brainSize;
  tilt;
  alive;

  constructor({
    control,
    patience,
    brainSize,
    tilt,
    alive,
  }: PlayerConstructor) {
    this.control = control;
    this.patience = patience;
    this.brainSize = brainSize;
    this.tilt = tilt;
    this.alive = alive;
  }

  swing(environment: Environment, lie: Lie) {
    // The club the player should hit based off of distance
    const idealClub = getClubFromDistanceToHole(lie.distanceToHole);
    let playersClub = idealClub;

    // Number from 1 - 20 to add or subtract to the distance
    const brainSizeDistanceModifier = Math.floor(Math.random() * 20);
    // 50/50 chance to add or remove the distance mod. (Club up or club down)
    const addOrRemoveDistance =
      Math.random() > 0.5
        ? -brainSizeDistanceModifier
        : brainSizeDistanceModifier;
    const brainSizeClub = getClubFromDistanceToHole(
      lie.distanceToHole + addOrRemoveDistance
    );
    playersClub = brainSizeClub;
    // const clubFromBrainSize =
  }
}

function getClubFromDistanceToHole(distanceToHole: number): string {
  let club: string;
  if (distanceToHole < 136) club = 'PW';
  else if (distanceToHole > 136 && distanceToHole < 148) club = '9';
  else if (distanceToHole > 148 && distanceToHole < 160) club = '8';
  else if (distanceToHole > 160 && distanceToHole < 172) club = '7';
  else if (distanceToHole > 172 && distanceToHole < 183) club = '6';
  else if (distanceToHole > 183 && distanceToHole < 194) club = '5';
  else if (distanceToHole > 194 && distanceToHole < 203) club = '4';
  else if (distanceToHole > 203 && distanceToHole < 212) club = '3';
  else if (distanceToHole > 212 && distanceToHole < 275) club = 'driver';
  else {
    throw new Error(
      'Could not find a suitable club? distance: ' + distanceToHole
    );
  }

  return club;
}
