type Environment = {
  weather: WeatherEffect;
};

type Lie = {
  condition: 'Rough' | 'Fescue' | 'Heavy Rough' | 'Fairway' | 'Teebox';
  distanceToHole: number;
};

type Clubs = 'P' | 'PW' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | 'D';

type ClubProficiency = Record<Clubs, number>;

type PlayerStats = {
  control: number;
  patience: number;
  brainSize: number;
  tilt: number;
  alive: boolean;
  proficiency: ClubProficiency;
};

type Affliction = {};

type WeatherNames = 'Hail';
type AfflictionNames = 'Roid Rage';

interface Player {
  id: string;
  name: string;
  hole: number;
  scoreCard: [number];
  afflictions: [Affliction];
  strokes: number;

  stats: PlayerStats;
  lie: Lie;

  swing(environment: Environment, lie: Lie): void;
}

type PlayerConstructor = Exclude<Player, 'alive'>;

type EventMessage = {
  info: {
    name: string;
    happening: string;
    triggeredBy: WeatherNames | AfflictionNames;
  };
  state?: PlayerStats;
};

interface WeatherEffect {
  name: string;
  roll({ player }: { player?: Player }): boolean;
  effect({ player }: { player?: Player }): EventMessage; // string will represent an event that is returned
}
