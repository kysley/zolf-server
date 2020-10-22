// export function getClubFromDistanceToHole(distanceToHole: number): Clubs {
//   let club: Clubs;
//   if (distanceToHole < 40) club = 'P';
//   else if (distanceToHole > 40 && distanceToHole < 120) club = 'PW';
//   else if (distanceToHole > 140 && distanceToHole < 155) club = '9';
//   else if (distanceToHole > 148 && distanceToHole < 160) club = '8';
//   else if (distanceToHole > 160 && distanceToHole < 172) club = '7';
//   else if (distanceToHole > 172 && distanceToHole < 183) club = '6';
//   else if (distanceToHole > 183 && distanceToHole < 194) club = '5';
//   else if (distanceToHole > 194 && distanceToHole < 203) club = '4';
//   else if (distanceToHole > 203 && distanceToHole < 212) club = '3';
//   else if (distanceToHole > 212) club = 'D';
//   else {
//     throw new Error(
//       'Could not find a suitable club? distance: ' + distanceToHole
//     );
//   }

//   return club;
// }

export function c(d: number, condition: Lie['condition']): Clubs {
  let clubUpX = 0;
  if (condition === 'Rough') clubUpX = 1;
  else if (condition === 'Heavy Rough') clubUpX = 2;
  else if (condition === 'Fescue') clubUpX = 3;

  function isBetween(min: number, max: number, is: number, inclusive = false) {
    return is > min && is < max;
  }

  const options = Object.keys(clubDistances).reduce((acc, key) => {
    const _d = clubDistances[key as Clubs];

    if (isBetween(_d[0], _d[1], d)) {
      acc.push(key as Clubs);
    }

    return acc;
  }, [] as Clubs[]);

  return options[clubUpX] || d < 40 ? 'P' : 'D';
}

export const clubDistances: Record<Clubs, number[]> = {
  P: [40, 40],
  PW: [120, 140],
  '9': [140, 170],
  '8': [155, 185],
  '7': [170, 200],
  '6': [180, 220],
  '5': [190, 230],
  '4': [200, 250],
  '3': [210, 260],
  D: [275, 250],
};
