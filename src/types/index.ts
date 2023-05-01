import {GolfPlayer} from '../entities/Player';

export enum Club {
  'P' = 'P',
  'AW' = 'AW',
  'PW' = 'PW',
  '9I' = '9I',
  '8I' = '8I',
  '7I' = '7I',
  '6I' = '6I',
  '5I' = '5I',
  '4I' = '4I',
  '3I' = '3I',
  'D' = 'D',
}

export enum Lies {
  'Rough' = 'Rough',
  'Fescue' = 'Fescue',
  'Heavy Rough' = 'Heavy Rough',
  'Fairway' = 'Fairway',
  'Teebox' = 'Teebox',
  'Green' = 'Green',
  'Bunker' = 'Bunker',
}

export type ClubProficiency = Record<Club, number>;

export type Hole = {
  yardage: number;
  par: number;
  number: number;
};

export type Course = {
  name: string;
  length: number;
  holes: Hole[];
};

export type Affliction = {};

export enum Weather {
  Hail = 'Hail',
}
export enum Status {}

export type EventMessage = {
  info: {
    name: string;
    happening: string;
    triggeredBy: Weather | Status;
  };
  state?: Stats;
};

// Changed this to an interface to add extensibility
export interface Stats {
  flair: number;
  mindset: number;
  strength: number;
  alive: boolean;
  proficiency: ClubProficiency;
}

export interface Lie {
  condition: Lies;
  distanceToHole: number;
}

export interface Round {
  players: GolfPlayer[];
  course: Course;
  weather: WeatherEffect;
}

export interface WeatherEffect {
  name: string;
  roll({player}: {player?: GolfPlayer}): boolean;
  effect({player}: {player?: GolfPlayer}): EventMessage; // string will represent an event that is returned
}
