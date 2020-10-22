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

  let options = Object.keys(clubDistances).reduce((acc, key) => {
    const _d = clubDistances[key as Clubs];

    if (isBetween(_d[0], _d[1], d)) {
      if (key === 'D' && condition !== 'Teebox') return acc;
      acc.push(key as Clubs);
    }

    return acc;
  }, [] as Clubs[]);

  // console.log(clubUpX, options, d, condition);

  if (options.includes('P')) return 'P';

  if (clubUpX >= options.length && options.length !== 0) {
    return options[options.length - 1];
  } else if (d > clubDistances['D'][0] && condition === 'Teebox') {
    return 'D';
  } else if (d > clubDistances['D'][0]) {
    options = ['3', '4', '5', '6'];
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
