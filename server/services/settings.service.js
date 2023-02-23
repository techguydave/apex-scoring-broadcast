const cache = require("./cache.service");
const { db } = require("../connectors/db");

const defaultBroadcastSettings = [
    {
        selected: [0],
        name: "Output 1",
        activeScene: 0,
        selectedMatch: undefined,
        scenes: [
            {
                id: 1,
                name: "Scene 1",
                overlays: [
                    {
                        id: "teamscoreboard",
                        name: "Scoreboard",
                        settings: {
                            "dark": true,
                            "game": "overall",
                            "mode": "team",
                            "header": true,
                            "styled": true,
                            "showCharacters": true,
                            "display": "score",
                            "display2": "kills",
                        }
                    }
                ]
            }
        ]
    }
]

function getCacheKey(org, event, option) {
    return `SETTINGS:${org}-${event}-${option}`;
}

async function getOrganizerMatch(organizerName) {
    return await cache.getOrSet(getCacheKey(organizerName, 0, "selected_match"), async () => {
        return await db("organizers")
            .where({ username: organizerName })
            .first("selected_match")
    }, 300);
}

async function setOrganizerMatch(organizerName, match) {
    await db("organizers")
        .where({ username: organizerName })
        .update({ "selected_match": match })

    cache.del(getCacheKey(organizerName, 0, "selected_match"));
}

async function getMatchList(organizerName) {
    return await cache.getOrSet(getCacheKey(organizerName, 0, "match_list"), async () => {
        let result = await db("match")
            .join("organizers", "organizers.id", "match.organizer")
            .where({ username: organizerName })
            .select("eventId");
        return result.map(e => e.eventId)
    }, 300)
}

async function setBroadcastSettings(organizer, settings) {
    console.log(settings);
    await db("broadcast_settings")
        .insert({ organizer: organizer.id, settings: JSON.stringify(settings) })
        .onConflict(["organizer"])
        .merge();

    cache.del(getCacheKey(organizer.username, 0, "broadcast"));
}

async function getBroadcastSettings(organizerName) {
    let result = await cache.getOrSet(getCacheKey(organizerName, 0, "broadcast"), async () => {
        let result = await db("broadcast_settings")
            .join("organizers", "organizers.id", "broadcast_settings.organizer")
            .where({ "username": organizerName })
            .first("settings");

        return result?.settings ?? defaultBroadcastSettings;
    }, 300)
    return result;
}


async function setMatchSettings(organizer, eventId, settings) {
    console.log(settings);
    await db("match_settings")
        .insert({ organizer: organizer.id, eventId, settings: JSON.stringify(settings) })
        .onConflict(["organizer", "eventId"])
        .merge();

    cache.del(getCacheKey(organizer.username, eventId, "match"));
}

async function getMatchSettings(organizerName, event) {
    return await cache.getOrSet(getCacheKey(organizerName, event, "match"), async () => {
        let result = await db("match_settings")
            .join("organizers", "organizers.id", "match_settings.organizer")
            .where({ "username": organizerName, eventId: event })
            .first("settings");

        return result?.settings;
    }, 300)
}

module.exports = {
    setBroadcastSettings,
    getBroadcastSettings,
    getMatchSettings,
    setMatchSettings,
    getOrganizerMatch,
    setOrganizerMatch,
    getMatchList,
}