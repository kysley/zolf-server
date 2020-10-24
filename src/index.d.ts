// NOTE: We should think about how these types are being used. If there is any case
// where we would be passing props to them ie. { prop: value } as Type then it would
// be better to write them as interfaces.
//
// NOTE: Types are mostly used for functions or complex types ie. tuples
// Complex type example:
//
// type MyComplexType = [string, number, Array<string>]
//
// Function example:
//
// type Person = {
//   name: string,
//   age: number
// };
//
// type ReturnPerson = (
//   person: Person
// ) => Person;
//
// const returnPerson: ReturnPerson = (person) => {
//   return person;
// };

type Clubs = 'P' | 'AW' | 'PW' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | 'D';

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

type Affliction = {};

type WeatherNames = 'Hail';
type AfflictionNames = 'Roid Rage'; // I lol'd at this

type EventMessage = {
  info: {
    name: string;
    happening: string;
    triggeredBy: WeatherNames | AfflictionNames;
  };
  state?: Stats;
};

// Changed this to an interface to add extensibility
interface Stats {
  control: number;
  patience: number;
  brainSize: number;
  tilt: number;
  alive: boolean;
  proficiency: ClubProficiency;
}

interface Lie {
  condition: string;
  distanceToHole: number;
}

interface Round {
  players: Player[];
  course: Course;
  weather: WeatherEffect;
}

interface Player {
  id: string;
  name: string;
  hole: number;
  course: Course;

  scoreCard?: number[];
  afflictions?: Affliction[];
  strokes?: number;
  stats?: Stats;
  lie?: Lie;

  start(): void;
  swing(): void;
}

interface WeatherEffect {
  name: string;
  roll({ player }: { player?: Player }): boolean;
  effect({ player }: { player?: Player }): EventMessage; // string will represent an event that is returned
}
