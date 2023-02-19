
const { redis, pubsub } = require("../connectors/redis");
const authService = require("./auth.service");
const liveService = require("./live.service");
const jsondiff = require("../utils/jsondiff");

function getLiveFeedKey(organizer, client, gameId) {
    return `livedata:feed-${organizer.username}-${client}-${gameId}`;
}

let liveData = {};

function getLiveData(orgName) {
    return liveData[orgName];
}

function setLiveData(orgName, data) {
    if (!data) {
        delete liveData[orgName];
    } else {
        liveData[orgName] = data;
    }
}

function diffLine(left, right, line) {
    let feed = right.feed.splice(left.feed.length, right.feed.length);
    let players = Object.keys(line).map(key => line[key].nucleusHash).filter(val => !!val).map(player => right.players[player]);
    let keyDiff = {};
    Object.keys(right).filter(key => !left[key] || (!(right[key] instanceof Object) && right[key] != left[key])).forEach(k => keyDiff[k] = right[k]);
    return { ...keyDiff, feed, players };
}

async function processUpdate(organizer, client, gameId, line, body) {
    const expr = 60 * 6;
    let feedKey = getLiveFeedKey(organizer, client, gameId);
    let channel = "ld-" + organizer.username;

    // Push our new line to the feed
    await redis.lpush(feedKey, body);
    await redis.expire(feedKey, expr);

    let current = getLiveData(organizer.username);
    let newData = liveService.processDataLine(line, current);
    setLiveData(organizer.username, newData);

    if (!current) {
        // if we dont have a current, publish full
        redis.publish(channel, JSON.stringify({ type: "ldfull", body: newData }));
        console.log("Sending full", newData)
    } else {
        // else publish the diff
        let diff = diffLine(current, newData, line);
        // console.log(diff);

        if (diff) {
            redis.publish(channel, JSON.stringify({ type: "lddiff", body: diff }));
        }
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
        let parsed = JSON.parse(msg);

        if (parsed.category == "init") {
            setLiveData(org.username, undefined);
            gameId = parsed.timestamp;
            console.log("Setting gameId to", gameId);
        }

        if (gameId) {
            await processUpdate(org, client, gameId, parsed, msg);
        } else {
            console.log("Game not starting from init, cannot process");
        }
    })
}

async function connectRead(ws, orgUser) {
    console.log("Connected read for ", orgUser);
    const channel = "ld-" + orgUser;
    pubsub.subscribe(channel);

    let sendFull = async () => {
        console.log("/sending full");
        ws.send(JSON.stringify({ type: "ldfull", body: getLiveData(orgUser) }));
    };

    pubsub.on("message", (incomingChannel, msg) => {
        if (incomingChannel == channel) {
            ws.send(msg);
        }
    })

    ws.on("message", async msg => {
        msg = JSON.parse(msg);
        if (msg.type == "ldrqfull") {
            await sendFull();
        }
    })
}

module.exports = {
    connectWrite,
    connectRead,
}