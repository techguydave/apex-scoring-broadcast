
const { redis, pubsub } = require("../connectors/redis");
const authService = require("./auth.service");
const liveService = require("./live.service");
const jsondiff = require("../utils/jsondiff");

function getLiveFeedKey(organizer, client, gameId) {
    return `livedata:feed-${organizer.username}-${client}-${gameId}`;
}

function getLiveGameKey(organizer) {
    return `livedata:game-${organizer.username}`;
}

async function processUpdate(organizer, client, gameId, body) {
    const expr = 60 * 6;
    let gameKey = getLiveGameKey(organizer);
    let feedKey = getLiveFeedKey(organizer, client, gameId);
    let channel = "ld-" + organizer.username;
    let current = JSON.parse(await redis.get(gameKey));
    let line = JSON.parse(body);

    // Push our new line to the feed
    await redis.lpush(feedKey, body);

    // null apparently counts as a value for default function values, change it to undef
    current = current || undefined;
    let newData = liveService.processDataLine(line, jsondiff.clone(current));

    // Set our data and make sure everything expires, we dont want MB of data setting around forever
    await redis.set(gameKey, JSON.stringify(newData));
    await redis.expire(feedKey, expr);
    await redis.expire(gameKey, expr);

    if (!current) {
        // if we dont have a current, publish full
        redis.publish(channel, JSON.stringify({ type: "ldfull", body: newData }));
        console.log("Sending full",)
    } else {
        // else publish the diff 
        let diff = jsondiff.diff(current, newData);
        redis.publish(channel, JSON.stringify({ type: "lddiff", body: diff }));
        console.log("Sending diff", diff)
    }

}

async function connectWrite(ws, api_key, client) {
    let org = await authService.getOrganizerByKey(api_key);
    let gameId;

    if (!org) {
        return;
    }

    console.log("WS Auth ", org.username);

    ws.on("message", async msg => {
        if (!gameId) {
            let parsed = JSON.parse(msg);
            if (parsed.category == "init") {
                await redis.del(getLiveGameKey(org.username));
                gameId = parsed.timestamp;
            }
        }

        if (gameId) {
            await processUpdate(org, client, gameId, msg);
        }
    })
}

function connectRead(ws, orgUser) {
    console.log("Connected read for ", orgUser);
    const channel = "ld-" + orgUser;
    pubsub.subscribe(channel);

    pubsub.on("message", (incomingChannel, msg) => {
        if (incomingChannel == channel) {
            ws.send(msg);
        }
    })

    ws.on("message", async msg => {
        msg = JSON.parse(msg);
        if (msg.type == "ldrqall") {
            ws.send(JSON.stringify({ type: "ldfull", body: JSON.parse(await redis.get(getLiveGameKey(orgUser))) }));
        }
    })
}

module.exports = {
    connectWrite,
    connectRead,
}