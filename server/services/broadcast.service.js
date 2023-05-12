
const cache = require("./cache.service");
const { db } = require("../connectors/db");

const defaultBroadcastSettings = [{
    "id": "8a0b9477-233a-42e6-b125-669f32a30614",
    "name": "Display 1",
    "scenes": [{
        "id": "1a22079b-a358-47e4-937b-d5f01c675d49",
        "name": "Scene 1",
        "overlays": [{
            "id": "c31a6190-e270-46a4-bfc9-ca6cad80e8ad",
            "name": "Scoreboard",
            "type": "Scoreboard",
            "settings": {
                "dark": true,
                "game": "overall",
                "mode": "team",
                "header": true,
                "styled": true,
                "display": "score",
                "display2": "kills",
                "showCharacters": true
            }
        }]
    }],
    "activeScene": "1a22079b-a358-47e4-937b-d5f01c675d49",
    "observerName": null,
    "selectedMatch": null,
    "selectedClient": null,
    "colors": {
        primary: "#970b0b",
        secondary: "#261f1f",
        background: "#000",
        text: "#fff",
        primaryText: "#fff",
        secondaryText: "#fff",
    }
}];


function getCacheKey(org, event, option) {
    return `SETTINGS:${org}-${event}-${option}`;
}

async function getOrganizerDefaultApexClient(organizerName) {
    return await cache.getOrSet(getCacheKey(organizerName, 0, "selected_apex_client"), async () => {
        return await db("organizers")
            .where({ username: organizerName })
            .first("selected_apex_client")
    }, 300);
}

async function setOrganizerDefaultApexClient(organizerName, apexClient) {
    await db("organizers")
        .where({ username: organizerName })
        .update({ "selected_apex_client": apexClient })

    cache.del(getCacheKey(organizerName, 0, "selected_apex_client"));
}


async function setBroadcastSettings(organizer, settings) {
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

        if (result?.settings) {
            result.settings.forEach(s => {
                if (!s.colors) {
                    s.colors = defaultBroadcastSettings[0].colors;
                }
            })
        }

        return result?.settings ?? defaultBroadcastSettings;
    }, 300)
    return result;
}
module.exports = {
    setBroadcastSettings,
    getBroadcastSettings,
    setOrganizerDefaultApexClient,
    getOrganizerDefaultApexClient,
}