import { redis } from '..';

const KEY = 'leaderboard';

async function add(id: string, integer: number) {
  return await redis.zadd(KEY, id, integer);
}

async function range(
  id: string,
  { start = 0, stop = -1 }: { start: number; stop: number }
) {
  return await redis.zrange(KEY, start, stop);
}

export const leaderboard = {
  add,
  range,
};
