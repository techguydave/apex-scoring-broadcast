const { redis } = require("../connectors/redis");
const config = require("../config/config.json");

const PREFIX = config.cachePrefix || "CACHE:";

async function put(key, value, time) {
    console.log("[CACHE] Put", key, time);

    value = JSON.stringify(value);
    if (time) {
        redis.setex(PREFIX + key, time, value);
    } else {
        redis.set(PREFIX + key, value);
    }
}

async function get(key) {
    let result = await redis.get(PREFIX + key);
    if (result) {
        return JSON.parse(result)
    }
}

async function getOrSet(key, func, time) {
    let result = await get(key);
    if (result) {
        return result;
    }

    result = await func();

    if (result) {
        await put(key, result, time);
    }
    return result;
}

async function del(key) {
    console.log("[CACHE] Del", key)
    return await redis.del(PREFIX + key);
}


module.exports = {
    put,
    get,
    del,
    getOrSet
}