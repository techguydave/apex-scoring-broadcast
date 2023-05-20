const { db } = require("../connectors/db");
const matchService = require("./match.service");
const { v4: uuid } = require('uuid');
const _ = require("lodash");

async function setDrop(matchId, pass, map, token, teamName, color, drop) {
    const settings = await matchService.getMatchSettings(matchId);
    const dropPass = settings.drops.pass; // yea this gets sent to the client so its not exactly secure
                                          // but it doesn't really matter for now
    
    if (pass !== dropPass) {
        console.log(pass, dropPass)
        return { err: "INVALID_PASSWORD" };
    }

    if (!token) {
        token = uuid();
    }
     
    await db("drops").insert({ matchId, map, token, teamName, color, drop });
    return {token};
}

async function deleteDrop(matchId, map, token, teamName, drop) {
    if (drop) {
        await db("drops").update({ "deletedAt": Date.now() }).where({ matchId, map, token, teamName, drop });
    } else {
        await db("drops").update({ "deletedAt": Date.now() }).where({ matchId, map, token, teamName });
    }
}

async function getMatchDrops(matchId, map) {
    let drops = await db("drops").select(['teamName','map', 'color', 'drop']).where({ matchId, map });

    drops = _.groupBy(drops, "teamName")
    return drops;
}


module.exports = {
    setDrop,
    getMatchDrops,
    deleteDrop,
}