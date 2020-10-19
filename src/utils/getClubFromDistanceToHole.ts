export function getClubFromDistanceToHole(distanceToHole: number): Clubs {
  let club: Clubs;
  if (distanceToHole < 50) club = 'P';
  else if (distanceToHole > 50 && distanceToHole < 136) club = 'PW';
  else if (distanceToHole > 136 && distanceToHole < 148) club = '9';
  else if (distanceToHole > 148 && distanceToHole < 160) club = '8';
  else if (distanceToHole > 160 && distanceToHole < 172) club = '7';
  else if (distanceToHole > 172 && distanceToHole < 183) club = '6';
  else if (distanceToHole > 183 && distanceToHole < 194) club = '5';
  else if (distanceToHole > 194 && distanceToHole < 203) club = '4';
  else if (distanceToHole > 203 && distanceToHole < 212) club = '3';
  else if (distanceToHole > 212 && distanceToHole < 275) club = 'D';
  else {
    throw new Error(
      'Could not find a suitable club? distance: ' + distanceToHole
    );
  }

  return club;
}
