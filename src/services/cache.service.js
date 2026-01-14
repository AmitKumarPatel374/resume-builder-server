import Redis from "ioredis"

const cacheInstance = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
})

export default cacheInstance
