
const redis = require("../connectors/redis");
const authService = require("./auth.service");
const liveService = require("./live.service");

function getLiveFeedKey(organizer, hostname, filename) {
    return `livedata:feed-${organizer.username}-${hostname}-${filename}`;
}

function getLiveGameKey(organizer, hostname, filename) {
    return `livedata:game-${organizer.username}-${hostname}-${filename}`;
}

async function processUpdate(organizer, hostname, filename, body) {
    const expr = 60 * 6;
    let gameKey = getLiveGameKey(organizer, hostname, filename);
    let feedKey = getLiveGameKey(organizer, hostname, filename);
    let current = JSON.parse(await redis.get(gameKey));
    let line = JSON.parse(body);

    // Push our new line to the feed
    await redis.lpush(getLiveFeedKey(organizer, hostname, filename), body);

    // We dont have a live data, lets read the current feed and init one
    if (!current) {
        let feed = (await redis.lrange(feedKey, 0 - 1)).map(JSON.parse);
        if (feed.length > 0) {
            current = liveService.processDataDump(feed);
        }
    }

    // We already have data, lets process the new line and update
    else {
        current = liveService.processDataLine(current, line);
    }

    // Set our data and make sure everything expires, we dont want MB of data setting around forever
    await redis.set(gameKey, JSON.stringify(current), expr);
    await redis.expire(feedKey, expr);
}

// live api v1,

// async function authHandler(ws, body) {
//     let organizer = await authService.getOrganizer(body.username, body.key);
//     if (organizer) {
//         ws.sendMsg("auth_accepted")
//         return { organizer, hostname: body.hostname };
//     } else {
//         ws.sendMsg("auth_denied")
//     }
// }

// function  connectWrite(ws) {
//     console.log("New Websocket Connect")
//     let organizer;
//     let hostname;
//     let filename;

//     ws.sendMsg = function (type, body) {
//         let msg = JSON.stringify({ type, body });
//         this.send(msg);
//     }

//     ws.on("message", async msg => {
//         console.log(msg);
//         let parsed = JSON.parse(msg);
//         let type = parsed.type;
//         let body = parsed.body;

//         if (type == "auth") {
//             ({ organizer, hostname } = await authHandler(ws, body));
//         }

//         else if (organizer) {
//             switch (type) {
//                 case "new_file":
//                     filename = body;
//                     // Delete any previous data, we will resend all this after the new file message
//                     await redis.del(getLiveGameKey(organizer, hostname, filename), getLiveFeedKey(organizer, hostname, filename));
//                     break;
//                 case "line":
//                     await processUpdate(organizer, hostname, filename, body);
//                     break;
//             }
//         }
//     })
// }

async function connectWrite(ws, api_key) {

    let org = await authService.getOrganizerByKey(api_key);

    if (!org) {
        return;
    }

    ws.on("message", async msg => {
        await processUpdate()
    })
}


module.exports = {
    connectWrite
}