export function c(d: number, condition: Lie['condition']): Clubs {
  let clubUpX = 0;
  // Based on the lie, we will club up a certain number of times
  if (condition === 'Rough') clubUpX = 1;
  else if (condition === 'Heavy Rough') clubUpX = 2;
  else if (condition === 'Fescue') clubUpX = 3;

  function isBetween(min: number, max: number, is: number, inclusive = false) {
    return is > min && is < max;
  }

  const x = Object.keys(clubDistances);

  let options = Object.keys(clubDistances).reduce<Clubs[]>((acc, key) => {
    const _d = clubDistances[key as Clubs];

    // If the distance to the hole is within the clubs' distance bounds
    if (isBetween(_d[0], _d[1], d)) {
      // For now, lets not let them hit the driver off the fairway (etc.) maybe we can revisit this idea
      if (key === 'D' && condition !== 'Teebox') return acc;
      acc.push(key as Clubs);
    }

    return acc;
  }, []);

  // console.log(clubUpX, options, d, condition);

  // Always return putter if we can
  if (options.includes(Clubs.P)) return Clubs.P;
  if (d > clubDistances['D'][0] && condition === 'Teebox') return Clubs['D'];
  else if (d > clubDistances['D'][0])
    options = [Clubs['3I'], Clubs['4I'], Clubs['5I'], Clubs['6I']];

  // Perhaps we use the brain size stat here..?
  const randomClubFromOptions =
    options[Math.floor(Math.random() * options.length)];

  const clubIdx = Object.keys(clubDistances).findIndex(
    (key) => key === randomClubFromOptions
  );

  if (clubIdx !== -1) {
    // We are clubbing up too many times, return highest club we have
    if (clubIdx - clubUpX <= 0) {
      return Clubs.AW;
    }
    return Object.keys(clubDistances)[clubIdx - clubUpX] as Clubs;
  }

  return options[clubUpX];
}

export const clubDistances: Record<Clubs, number[]> = {
  [Clubs.P]: [0, 40],
  [Clubs.AW]: [40, 120],
  [Clubs.PW]: [120, 140],
  [Clubs['8I']]: [155, 185],
  [Clubs['9I']]: [140, 170],
  [Clubs['7I']]: [170, 200],
  [Clubs['6I']]: [180, 220],
  [Clubs['5I']]: [190, 230],
  [Clubs['4I']]: [200, 250],
  [Clubs['3I']]: [210, 260],
  [Clubs.D]: [250, 275],
};
