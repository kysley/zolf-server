export function c(d: number, condition: Lie['condition']): Clubs {
  let clubUpX = 0;
  // Based on the lie, we will club up a certain number of times
  if (condition === 'Rough') clubUpX = 1;
  else if (condition === 'Heavy Rough') clubUpX = 2;
  else if (condition === 'Fescue') clubUpX = 3;

  function isBetween(min: number, max: number, is: number, inclusive = false) {
    return is > min && is < max;
  }

  let options = Object.keys(clubDistances).reduce((acc, key) => {
    const _d = clubDistances[key as Clubs];

    // If the distance to the hole is within the clubs' distance bounds
    if (isBetween(_d[0], _d[1], d)) {
      // For now, lets not let them hit the driver off the fairway (etc.) maybe we can revisit this idea
      if (key === 'D' && condition !== 'Teebox') return acc;
      acc.push(key as Clubs);
    }

    return acc;
  }, [] as Clubs[]);

  // console.log(clubUpX, options, d, condition);

  // Always return putter if we can
  if (options.includes('P')) return 'P';
  if (d > clubDistances['D'][0] && condition === 'Teebox') return 'D';
  else if (d > clubDistances['D'][0]) options = ['3', '4', '5', '6'];

  const randomClubFromOptions =
    options[Math.floor(Math.random() * options.length)];

  const clubIdx = Object.keys(clubDistances).findIndex(
    (key) => key === randomClubFromOptions
  );

  if (clubIdx !== -1) {
    // We are clubbing up too many times, return highest club we have
    if (clubIdx - clubUpX <= 0) {
      return 'AW';
    }
    return Object.keys(clubDistances)[clubIdx - clubUpX] as Clubs;
  }

  return options[clubUpX];
}

export const clubDistances: Record<Clubs, number[]> = {
  P: [0, 40],
  AW: [40, 120],
  PW: [120, 140],
  '9': [140, 170],
  '8': [155, 185],
  '7': [170, 200],
  '6': [180, 220],
  '5': [190, 230],
  '4': [200, 250],
  '3': [210, 260],
  D: [250, 275],
};
