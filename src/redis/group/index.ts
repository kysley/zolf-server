import { redis } from '..';

async function get(id: string) {
  return await redis.hgetall('group:' + id);
}
