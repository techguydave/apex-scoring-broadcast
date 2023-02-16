const Redis = require("ioredis");
const config = require("../config/config.json");
const redis = new Redis(config.redis);
const pubsub = new Redis(config.redis);

redis.isConnected = async () => {
    try {
        let result = await redis.echo("online");
        console.log("Redis says ", result)
        return result == "online";
    } catch (err) {
        return false;
    }
}

module.exports = { redis, pubsub };