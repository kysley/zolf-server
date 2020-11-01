import { redis } from '..';
import { Player } from '../../types';

interface LiveGolfer extends Player {
  id: string;
}

export const PREFIX = 'golfer';

async function get(id: string) {
  return await redis.hgetall(`${PREFIX}:${id}`);
}

async function set(id: string, ...args: any[]) {
  if (Array.isArray(args)) {
    return await redis.hset(`${PREFIX}:${id}`, ...args);
  } else {
    const key = args[0];
    const value = args[1];
    return await redis.hset(`${PREFIX}:${id}`, { [key]: value });
  }
}

export const golfer = {
  get,
  set,
};
