const defaultStruck = {
    players: {},
    damageFeed: [],
    killFeed: [],
}

test();
function test() {
    let data = require("../../local/mock/mock.json");
    let result = processDataDump(data);

    console.log(JSON.stringify(result));
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
        case "playerConnected":
        case "characterSelected":
            players[pid] = {
                ...line.player,
                currentWeapon: undefined,
                shots: 0,
                damageDealt: 0,
                damageTaken: 0,
                tactical: 0,
                ultimate: 0,
                grenades: 0,
                knocks: 0,
                revives: 0,
                kills: 0,
                status: "alive",
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
                players[pid].tactical += 1;
            } else if (line.linkedEntity.includes("Ultimate")) {
                players[pid].ultimate += 1;
            }
            break;
        case "grenadeThrown":
            if (!line.linkedEntity.includes("Tactical") && !line.linkedEntity.includes("Ultimate")) {
                players[pid].grenades += 1;
            }
            break;
        case "playerDowned":
            data.killFeed.push({ type: "knock", attacker: line.attacker, victim: line.victim, weapon: line.weapon, damage: line.damageInflicted });
            players[line.attacker.nucleusHash].knocks += 1;
            players[line.victim.nucleusHash].status = "knocked";
            break;
        case "playerKilled":
            data.killFeed.push({ type: "kill", attacker: line.awardedTo, victim: line.victim, weapon: line.weapon, damage: line.damageInflicted });
            players[line.awardedTo.nucleusHash].kills += 1;
            players[line.victim.nucleusHash].status = "dead";
            break;
        case "playerRespawnTeam":
            let hash = Object.values(players).find(player => player.name == line.respawned).nucleusHash;
            data.killFeed.push({ type: "respawn", player: { nucleusHash: hash, name: line.respawned } });
            players[hash].status = "alive";
            break;
        case "playerRevive":
            players[line.revived.nucleusHash].status = "alive";
            data.killFeed.push({ type: "revive", player: line.revived });
            players[line.revived.nucleusHash].status = "alive";
            break;

    }

    if (line.player) {
        players[pid].currentHealth = line.player.currentHealth;
        players[pid].shieldHealth = line.player.shieldHealth;
    }

    return data;
}


module.exports = {
    processDataDump,
    processDataLine,
}