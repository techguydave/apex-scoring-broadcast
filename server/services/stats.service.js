const { db } = require("../connectors/db");
const _ = require("lodash");

function assembleStatsDocuments(games, teams, players) {
    let teamsByGame = _(teams).groupBy("gameId").value();
    let playersByGame = _(players).groupBy("gameId").value();

    games.forEach(game => {
        game.teams = teamsByGame[game.id].map(team => {
            return {
                teamId: team.teamId,
                name: team.name,
                overall_stats: team,
                player_stats: playersByGame[game.id].filter(player => player.teamId == team.teamId)
            }
        })
    });
    return games.sort((a, b) => a.id - b.id);
}

async function getStats(organizer, eventId, game) {
    let where = game == "overall" ? { organizer, eventId } : { organizer, eventId, game };
    try {
        let games = await db("game")
            .where(where)
            .select("*");

        let teams = await db("team_game_stats").whereIn("gameId", games.map(game => game.id))
        let players = await db("player_game_stats")
            .select(db.raw("player_game_stats.*, players.id as \"playerId\""))
            .join("players", "players.playerId", "=", "player_game_stats.playerId")
            .whereIn("gameId", games.map(game => game.id));

        return assembleStatsDocuments(games, teams, players);
    } catch (err) {
        console.error(err);
    }
}

async function deleteStats(organizer, eventId, game) {
    try {
        await db.transaction(async trx => {
            let previousGame = await trx("game").
                where({ organizer, eventId, game })
                .first("id");

            if (previousGame) {
                console.log("Deleting game " + previousGame.id);
                await trx("game")
                    .where({ id: previousGame.id })
                    .del();

                await trx("team_game_stats")
                    .where({ gameId: previousGame.id })
                    .del();

                await trx("player_game_stats")
                    .where({ gameId: previousGame.id })
                    .del();
            }
        })
    } catch (err) {
        console.error("Error deleting stats", err);
        throw err;
    }
}

async function writeStats(organizer, eventId, game, data, source) {
    try {
        let gameId = undefined;
        await db.transaction(async trx => {
            console.log({ organizer, eventId, game })
            await deleteStats(organizer, eventId, game);

            let matchId = await trx("match").where({
                organizer, eventId
            }).first("id");

            if (!matchId) {
                matchId = await trx("match").insert({ organizer, eventId }, ["id"]);
                matchId = matchId[0];
            }

            matchId = matchId.id;


            let gameResult = await trx("game").insert({
                eventId,
                game,
                matchId,
                organizer: organizer,
                match_start: data.match_start,
                mid: data.mid,
                map_name: data.map_name,
                aim_assist_allowed: data.aim_assist_allowed,
                source,
            }, ["id"])


            gameId = gameResult[0].id;

            let teamStats = data.teams.map(team => {
                return {
                    ...team.overall_stats,
                    teamId: team.id,
                    gameId: gameId,
                    name: team.name,
                    matchId,
                }
            });

            let playerStats = data.teams.map(team =>
                team.player_stats.map(player => {
                    let playerData = {
                        ...player,
                        teamId: team.id,
                        playerId: player.nidHash,
                        gameId,
                        matchId
                    }
                    delete playerData.nidHash;
                    delete playerData.playerName;
                    delete playerData.teamNum;

                    return playerData;
                })
            ).flat();

            await trx("team_game_stats").insert(teamStats);
            await trx("player_game_stats").insert(playerStats);

            await Promise.all(playerStats.map(p => trx("players").insert({ playerId: p.playerId }).onConflict().ignore()))

        });
        return gameId;
    } catch (err) {
        console.error("Failed to insert game into db", err);
        throw err;
    }
}

async function getGameList(organizer, eventId) {
    try {
        let result = await db("game")
            .orderBy("game", "asc")
            .where({ organizer, eventId })
            .select("*");
        return result;
    } catch (err) {
        console.error(err)
        return 0;
    }
}

async function getLatest() {
    try {
        let matches = await db("match")
            .join("organizers", "organizers.id", "match.organizer")
            .orderBy("match.id", "desc")
            .limit(8)
            .select("*");

        if (matches) {
            let stats = await Promise.all(matches.map(match => new Promise(async (res) => {
                let stats = await getStats(match.organizer, match.eventId, "overall");
                res({ ...match, stats })
            })));
            return stats;
        } else {
            return [];
        }

    } catch (err) {
        console.log(err);
        return undefined;
    }
}


async function writeLiveData(gameId, data, organizer) {
    data = JSON.stringify(data);
    let date = new Date();
    await db("livedata").insert({ gameId, data, date, organizer });
}

async function setLiveDataGame(liveId, gameId) {
    await db("livedata").update({ gameId }).where({ id: liveId });
}

async function hasLiveData(organizer, eventId, game) {
    if (!isNaN(game)) {
        let result = await db("game").first("*").where({ organizer, eventId, game });
        if (result && result.source.includes("livedata")) {
            return result.id;
        }
    }
}

async function getLiveData(gameId) {
    let data = await db("livedata")
        .first("*")
        .where({ gameId });
    return JSON.parse(data.data);
}

async function getUnclaimedLiveData(organizer) {
    let data = await db("livedata")
        .select(["id", "date"])
        .where({ organizer })
        .whereNull("gameId");
    return data;
}

module.exports = {
    writeStats,
    getStats,
    getGameList,
    deleteStats,
    getLatest,
    writeLiveData,
    hasLiveData,
    getLiveData,
    setLiveDataGame,
    getUnclaimedLiveData,
}