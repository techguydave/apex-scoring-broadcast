const _ = require("lodash");

const defaultStruck = {
    match_start: 0,
    state: "preinit",
    totalTeams: 0,
    teamsAlive: 0,
    serverConfig: {},
    players: {},
    damageFeed: [],
    killFeed: [],
}

const STATUS = {
    ALIVE: "alive",
    DOWNED: "downed",
    DEAD: "dead",
    CARD_COLLECTED: "card_collected",
}


// test();
function test() {
    let data = require("../../local/mock/mock.json");
    let result = processDataDump(data);

    console.log(JSON.stringify(convertLiveDataToRespawnApi(result)));
    // console.log(JSON.stringify(result));
}

function processDataDump(chunk, data = defaultStruck) {
    for (let line of chunk) {
        processDataLine(line, data);
    }

    return data;
}

function processDataLine(line, data) {
    let pid = line.player ? line.player.nucleusHash : undefined;
    let players = data.players;

    switch (line.category) {
        case "init":
            data.match_start = line.timestamp;
            break;
        case "gameStateChanged":
        case "matchStateEnd":
            data.state = line.state;
            if (data.state === "PickLoadout") {
                //determine # of starting teams
                let count = _.uniqBy(Object.values(data.players), "teamId").length;
                data.totalTeams = count;
                data.teamsAlive = count;
            }

            if (data.state === "WinnerDetermined") {
                line.winners.forEach(player => {
                    data.players[player.nucleusHash].teamPlacement = 1;
                })
            }
            break;
        case "matchSetup":
            data.serverConfig = line;
            break;
        case "playerConnected":
        case "characterSelected":
            // Dont include spectators
            if (line.player.teamId > 1)
                players[pid] = {
                    ...line.player,
                    currentWeapon: undefined,
                    shots: 0,
                    damageDealt: 0,
                    damageTaken: 0,
                    tacticalsUsed: 0,
                    ultimatesUsed: 0,
                    grenadesThrown: 0,
                    knockdowns: 0,
                    teamPlacement: 20,
                    revives: 0,
                    kills: 0,
                    status: STATUS.ALIVE,
                };
            break;
        case "weaponSwitched":
            players[pid].currentWeapon = line.newWeapon;
            break;
        case "playerDamaged":
            if (line.attacker.nucleusHash) {
                let attacker = players[line.attacker.nucleusHash]
                attacker.damageDealt += line.damageInflicted;
            }
            data.damageFeed.push({ attacker: line.attacker, victim: line.victim, weapon: line.weapon, damage: line.damageInflicted });

            let victim = players[line.victim.nucleusHash];
            victim.damageTaken += line.damageInflicted;
            victim.currentHealth = line.victim.currentHealth;
            victim.shieldHealth = line.victim.shieldHealth;
            break;
        case "playerAbilityUsed":
            if (line.linkedEntity.includes("Tactical")) {
                players[pid].tacticalsUsed += 1;
            } else if (line.linkedEntity.includes("Ultimate")) {
                players[pid].ultimatesUsed += 1;
            }
            break;
        case "grenadeThrown":
            if (!line.linkedEntity.includes("Tactical") && !line.linkedEntity.includes("Ultimate")) {
                players[pid].grenadesThrown += 1;
            }
            break;
        case "playerDowned":
            data.killFeed.push({ type: "down", attacker: line.attacker, victim: line.victim, weapon: line.weapon, damage: line.damageInflicted });
            players[line.attacker.nucleusHash].knockdowns += 1;
            players[line.victim.nucleusHash].status = STATUS.DOWNED;
            break;
        case "playerKilled":
            if (players[line.victim.nucleusHash].status == STATUS.ALIVE) {
                //work around for missing downed events, make sure we push a down to the killfeed;
                //console.log("Deriving down for ", line.awardedTo, line.victim);
                data.killFeed.push({ type: "down", attacker: line.awardedTo.nucleusHash, victim: line.victim, weapon: line.weapon, damage: 0, derived: true });
                data.players[line.awardedTo.nucleusHash].knockdowns += 1;
            }

            data.killFeed.push({ type: "kill", attacker: line.awardedTo, victim: line.victim, weapon: line.weapon, damage: line.damageInflicted });
            players[line.awardedTo.nucleusHash].kills += 1;
            players[line.victim.nucleusHash].status = STATUS.DEAD;
            break;
        case "playerRespawnTeam":
            let hash = Object.values(players).find(player => player.name == line.respawned).nucleusHash;
            data.killFeed.push({ type: "respawn", player: { nucleusHash: hash, name: line.respawned } });
            players[hash].status = STATUS.ALIVE;
            break;
        case "playerRevive":
            players[line.revived.nucleusHash].status = STATUS.ALIVE;
            data.killFeed.push({ type: "revive", player: line.revived });
            players[line.revived.nucleusHash].status = STATUS.ALIVE;
            break;
        case "squadEliminated":
            line.players.forEach(player => {
                data.players[player.nucleusHash].teamPlacement = data.teamsAlive;
            })
            data.teamsAlive -= 1;
            break;
    }

    if (line.player && line.player.teamId > 1) {
        players[pid].currentHealth = line.player.currentHealth;
        players[pid].shieldHealth = line.player.shieldHealth;
    }

    return data;
}

function convertLiveDataToRespawnApi(data) {
    let player_results = Object.values(data.players).map(player => ({
        playerName: player.name,
        teamNum: player.teamId,
        teamName: player.teamName,
        shots: player.shots,
        hits: player.hits,
        knockdowns: player.knockdowns,
        damageDealt: player.damageDealt,
        teamPlacement: player.teamPlacement,
        characterName: player.character,
        nidHash: player.nucleusHash,
        skin: player.skin,
        grenadesThrown: player.grenadesThrown,
        ultimatesUsed: player.ultimatesUsed,
        tacticalsUsed: player.tacticalsUsed,
    }));

    return {
        matches: [{
            match_start: data.match_start,
            player_results,
            server: `(${data.serverConfig.datacenter.name})${data.serverConfig.serverId}`,
            map_name: data.serverConfig.map,
            aim_assist_allowed: !data.serverConfig.aimAssistOn,
            anonymousMode: data.serverConfig.anonymousMode,
        }]
    }
}


module.exports = {
    processDataDump,
    processDataLine,
    convertLiveDataToRespawnApi
}