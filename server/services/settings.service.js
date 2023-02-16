const cache = require("./cache.service");
const { db } = require("../connectors/db");

function getCacheKey(org, event, option) {
    return `SETTINGS:${org}-${event}-${option}`;
}

async function setBroadcastSettings(organizer, settings) {
    console.log(settings);
    await db("broadcast_settings")
        .insert({ organizer: organizer.id, settings: JSON.stringify(settings) })
        .onConflict(["organizer"])
        .merge();

    cache.del(getCacheKey(organizer.name, 0, "broadcast"));
}

async function getBroadcastSettings(organizerName, event) {
    return cache.getOrSet(getCacheKey(organizerName, event, "broadcast"), async () => {
        let result = await db("match_settings")
            .join("organizers", "organizers.id", "match_settings.organizer")
            .where({ "username": organizerName, eventId: event })
            .first("*");

        return result;
    })
}


async function setMatchSettings(organizer, eventId, settings) {
    console.log(settings);
    await db("match_settings")
        .insert({ organizer: organizer.id, eventId, settings: JSON.stringify(settings) })
        .onConflict(["organizer", "eventId"])
        .merge();

    cache.del(getCacheKey(organizer.name, eventId, "match"));
}

async function getMatchSettings(organizerName, event) {
    return await cache.getOrSet(getCacheKey(organizerName, event, "match"), async () => {
        let result = await db("match_settings")
            .join("organizers", "organizers.id", "match_settings.organizer")
            .where({ "username": organizerName, eventId: event })
            .first("*");

        return result;
    })
}

module.exports = {
    setBroadcastSettings,
    getBroadcastSettings,
    getMatchSettings,
    setMatchSettings,
}