type Lie = {
  condition:
    | 'Rough'
    | 'Fescue'
    | 'Heavy Rough'
    | 'Fairway'
    | 'Teebox'
    | 'Green';
  distanceToHole: number;
};

type Clubs = 'P' | 'PW' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | 'D';

type ClubProficiency = Record<Clubs, number>;

type Hole = {
  yardage: number;
  par: number;
};

type Course = {
  name: string;
  length: number;
  holes: Hole[];
};

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

interface Round {
  players: Player[];
  course: Course;
  weather: WeatherEffect;
}

interface Player {
  id: string;
  name: string;
  hole: number;
  scoreCard: number[];
  afflictions: Affliction[];
  strokes: number;

  stats: PlayerStats;
  lie: Lie;
  course: Course;
  start(): void;

  swing(): void;
}

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
