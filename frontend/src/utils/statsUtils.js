const _ = require("lodash");

const displayOptions = {
    mode: ["team", "player"],
    display: {
        team: [
            "score",
            "kills",
            "damageDealt",
            "revivesGiven",
            "headshots",
            "assists",
            "respawnsGiven",
            "hits",
            "knockdowns",
            "shots",
            "grenadesThrown",
            "tacticalsUsed",
            "ultimatesUsed",
            "bestGame",
            "bestPlacement",
            "bestKills",
        ],
        player: [
            "characterName",
            "kills",
            "damageDealt",
            "knockdowns",
            "assists",
            "survivalTime",
            "headshots",
            "hits",
            "shots",
            "respawnsGiven",
            "revivesGiven",
            "grenadesThrown",
            "tacticalsUsed",
            "ultimatesUsed",
        ],
    },
    game: ["overall", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
}

const invertedStats = ["position", "bestPlacement"]
const statDisplayMapping = {
    "bestPlacement": "Best Placement",
    "survivalTime": "Time",
    "bestGame": "Best Game",
    "damageDealt": "Damage",
    "bestKills": "Best Kills",
    "revivesGiven": "Revives",
    "respawnsGiven": "Respawns",
    "characterName": "Legend",
    "knockdowns": "Downs",
    "grenadesThrown": "Grenades",
    "tacticalsUsed": "Tacts",
    "ultimatesUsed": "Ults",
}

const mapMap = {
    "mp_rr_canyonlands_hu": "Kings Canyon (Season 14)",
    "mp_rr_tropic_island_mu1": "Storm Point (Season 13)",
    "mp_rr_desertlands_mu3": "Worlds Edge (Season 10)",
    "mp_rr_olympus_mu2": "Olympus (Season 12)",
    "mp_rr_divided_moon": "Broken Moon (Season 15)"
}

const mapMapShort = {
    "mp_rr_canyonlands_hu": "Kings Canyon",
    "mp_rr_tropic_island_mu1": "Storm Point",
    "mp_rr_desertlands_mu3": "Worlds Edge",
    "mp_rr_olympus_mu2": "Olympus",
    "mp_rr_divided_moon": "Broken Moon"
}

function sortScores(scores, sortKey) {
    if (sortKey == "score") {
        sortKey = scores[0].position ? "position" : "score"
    }

    scores = scores.sort((a, b) => {
        if (invertedStats.includes(sortKey)) {
            if (a[sortKey] == "") return 1;
            if (b[sortKey] == "") return -1;

            return a[sortKey] - b[sortKey];
        } else {
            return b[sortKey] - a[sortKey];
        }
    });
    return scores;
}

function getStatsByMode(teams, mode) {
    if (mode == "team") {
        return teams.map(team => ({ teamId: team.teamId, ...team.overall_stats }));
    } else {
        return teams.map(team => [...team.player_stats]).flat();
    }
}

function getPlayersByTeam(teams, teamId) {
    return (_.find(teams, stat => stat.teamId == teamId) || { player_stats: [] }).player_stats;
}

function getCharactersByTeam(teams, teamId) {
    return _(getPlayersByTeam(teams, teamId).map(player => player.characters || player.characterName)).zip().flattenDeep().uniq().value();
}

function getDisplayName(name) {
    return statDisplayMapping[name] || name;
}

function getMapName(mapid) {
    return mapMap[mapid] || mapid;
}

function getMapNameShort(mapid) {
    return mapMapShort[mapid] || mapid;
}


module.exports = {
    invertedStats,
    statDisplayMapping,
    displayOptions,
    sortScores,
    getDisplayName,
    getStatsByMode,
    getPlayersByTeam,
    getCharactersByTeam,
    getMapName,
    getMapNameShort,
}
