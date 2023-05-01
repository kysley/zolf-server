import {Club, Lie, Lies} from '../types';

export function c(distance: number, condition: Lie['condition']): Club {
  let clubUpX = 0;
  // Based on the lie, we will club up a certain number of times
  if (condition === Lies.Rough) clubUpX = 1;
  else if (condition === Lies['Heavy Rough']) clubUpX = 2;
  else if (condition === Lies.Fescue) clubUpX = 3;

  function isBetween(min: number, max: number, is: number, inclusive = false) {
    return is >= min && is <= max;
  }

  const x = Object.keys(clubDistances);

  let options = Object.keys(clubDistances).reduce<Club[]>((acc, key) => {
    const [minimum, maximum] = clubDistances[key as Club];

    // If the distance to the hole is within the clubs' distance bounds
    if (isBetween(minimum, maximum, distance)) {
      // For now, lets not let them hit the driver off the fairway (etc.) maybe we can revisit this idea
      if (key === 'D' && condition !== Lies.Teebox) return acc;
      acc.push(key as Club);
    }

    return acc;
  }, []);

  // Always return putter if we can
  if (options.includes(Club.P) || condition === Lies.Green) return Club.P;
  if (distance > clubDistances['D'][0] && condition === Lies.Teebox)
    return Club['D'];
  else if (distance > clubDistances['D'][0])
    options = [Club['3I'], Club['4I'], Club['5I'], Club['6I']];

  // Perhaps we use the brain size stat here..?
  const randomClubFromOptions =
    options[Math.floor(Math.random() * options.length)];

  const clubIdx = Object.keys(clubDistances).findIndex(
    (key) => key === randomClubFromOptions,
  );

  console.log(clubUpX, options, distance, condition);
  if (clubIdx !== -1) {
    // We are clubbing up too many times, return highest club we have
    if (clubIdx - clubUpX <= 0) {
      return Club.AW;
    }
    return Object.keys(clubDistances)[clubIdx - clubUpX] as Club;
  }

  return randomClubFromOptions;
}

export const clubDistances: Record<Club, number[]> = {
  [Club.P]: [0, 20],
  [Club.AW]: [20, 120],
  [Club.PW]: [120, 140],
  [Club['9I']]: [140, 170],
  [Club['8I']]: [155, 185],
  [Club['7I']]: [170, 200],
  [Club['6I']]: [180, 220],
  [Club['5I']]: [190, 230],
  [Club['4I']]: [200, 250],
  [Club['3I']]: [210, 260],
  [Club.D]: [250, 275],
};
