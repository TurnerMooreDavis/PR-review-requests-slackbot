import * as redis from 'redis'    
import {promisify} from 'util'

export const redisCli = redis.createClient();

export async function setRedisKey(cli: redis.RedisClient, key: string, val: string) {
  const setAsync = promisify(cli.set).bind(cli)
  return await setAsync(key, val)
}

export async function getRedisKey(cli: redis.RedisClient, key: string) {
  const getAsync = promisify(cli.get).bind(cli)
  return await getAsync(key)
}