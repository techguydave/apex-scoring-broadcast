
const statsService = require("../services/stats.service")
const config = require("../config/config.json")
config.statsUrl = process.argv[2] || config.statsUrl;
const { verifyOrganizerHeaders, verifyAdminHeaders } = require("../middleware/auth");
const apexService = new require("../services/apex.service")(config);
const authService = require("../services/auth.service");
const settingService = require("../services/settings.service");
const cache = require("../services/cache.service");
const shortLinkService = require("../services/short_link.service.js");
const wsHandlerService = require("../services/ws_handler.service.js");
const liveService = require("../services/live.service");
const { getOr } = require("../utils/utils");
const playerService = require("../services/player.service");

const SHORT_LINK_PREFIX = "_";
module.exports = function router(app) {

    async function deleteCache(username, eventId, game) {
        await cache.del(`stats:${username}-${eventId}-${game}`);
        await cache.del(`stats:${username}-${eventId}-overall`);
        await cache.del(`stats:${username}-${eventId}-stacked`);
        await cache.del(`stats:${username}-${eventId}-summary`);
        await cache.del(`stats:${username}-${eventId}-${game}-livedata-parsed`);
    }

    async function getStats(organizer, eventId, game, stacked = false) {
        let orgId = await authService.getOrganizerId(organizer)
        let stats = await statsService.getStats(orgId, eventId, game);

        if (!stats || stats.length == 0) {
            return {};
        }

        if (game == "overall" || stacked) {
            stats = {
                total: stats.length,
                games: stats,
                teams: apexService.generateOverallStats(stats),
                stacked: stacked ? stats.map((_, index) => apexService.generateOverallStats(stats.slice(0, index + 1))) : undefined
            }
        } else {
            stats = stats[0];
        }
        return stats;
    }

    app.get("/mock", (req, res) => {
        const mockStats = require("../mock/eastats3.json")
        res.json(mockStats)
    })

    app.post("/auth/organizer", async (req, res) => {
        const {
            key, username
        } = req.body;

        let organizer = await authService.getOrganizer(username, key);

        res.send({
            valid: organizer != undefined
        })
    })

    app.post("/auth/create", verifyAdminHeaders, async (req, res) => {
        const {
            username
        } = req.body;

        let organizer = await authService.createOrganizer(username);

        res.send(organizer);
    })

    app.post("/settings/broadcast/:organizer", verifyOrganizerHeaders, async (req, res) => {
        await settingService.setBroadcastSettings(req.organizer, req.body);
        res.sendStatus(200);
    })

    app.get("/settings/broadcast/:organizer", async (req, res) => {
        let result = await settingService.getBroadcastSettings(req.params.organizer);
        res.send(result);
    })

    app.post("/settings/match/:organizer/:eventId", verifyOrganizerHeaders, async (req, res) => {
        await settingService.setPublicSettings(req.organizer, req.params.eventId, req.body);
        res.sendStatus(200);
    })

    app.get("/settings/match/:organizer/:eventId", async (req, res) => {
        let result = await settingService.getPublicSettings(req.params.organizer, req.params.eventId);
        res.send(result);
    })

    app.get("/stats/code/:statsCode", verifyOrganizerHeaders, async (req, res) => {
        let stats = await apexService.getStatsFromCode(req.params.statsCode);
        stats = stats.map(stat => apexService.generateGameReport(stat));

        res.send(stats);
    })

    app.post("/stats", verifyOrganizerHeaders, async (req, res) => {
        let { eventId, game, statsCode, startTime, placementPoints, killPoints } = req.body;
        const liveDataFile = getOr(req.files, {})["liveData"];

        placementPoints = placementPoints.split(",").map(n => parseInt(n))

        let respawnStats = undefined;
        if (statsCode && statsCode.length > 0 && statsCode !== "undefined") {
            respawnStats = await apexService.getMatchFromCode(statsCode, startTime);
        }

        if (!respawnStats && !liveDataFile) {
            return res.sendStatus(404);
        }

        let liveDataStats = undefined;
        let liveDataJson = undefined;

        if (liveDataFile) {
            try {
                liveDataJson = JSON.parse(liveDataFile.data.toString());
                liveDataStats = liveService.processDataDump(liveDataJson);
                liveDataStats = liveService.convertLiveDataToRespawnApi(liveDataStats).matches[0];
            } catch (err) {
                console.error(err)
                return res.status(500).send({ err: "live_data_parse", msg: "The uploaded file is not valid." })
            }
        }

        let gameStats = undefined;
        let source = "";
        if (liveDataStats && respawnStats) {
            gameStats = apexService.mergeStats(respawnStats, liveDataStats);
            source = "statscode+livedata";
        }
        else if (liveDataStats) {
            gameStats = liveDataStats;
            source = "livedata";
        }
        else {
            gameStats = respawnStats;
            source = "statscode";
        }

        gameStats = apexService.generateGameReport(gameStats, placementPoints, killPoints);

        try {
            //console.log(JSON.stringify(gameStats))
            let gameId = await statsService.writeStats(req.organizer.id, eventId, game, gameStats, source);
            console.log(!!liveDataJson, gameId)
            if (liveDataJson && gameId) {
                await statsService.writeLiveData(gameId, liveDataJson)
            }
            await deleteCache(req.organizer.username, eventId, game);

            return res.status(200).send(gameStats);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ err: "live_data_parse", msg: "Something went wrong adding the game." });
        }

    })


    app.get("/stats/:organizer/:eventId/:game/livedata", async (req, res) => {
        const {
            organizer,
            eventId,
            game
        } = req.params;

        let key = `stats:${organizer}-${eventId}-${game}-livedata-parsed`;
        try {
            let data = await cache.getOrSet(key, async () => {
                let orgId = await authService.getOrganizerId(organizer)
                let gameId = await statsService.hasLiveData(orgId, eventId, game);

                if (!gameId) {
                    return { err: "err_no_data", msg: "This game doesn't have any live data attached" }
                }
                let data = await statsService.getLiveData(gameId);
                let parsed = liveService.processDataDump(data);

                return parsed;
            }, 300)

            res.send(data);
        } catch (err) {
            res.send({ err: "err_retriving_data", msg: "Error getting live data" });
        }
    })

    app.get("/games/:organizer/:eventId", async (req, res) => {
        const {
            organizer,
            eventId,
        } = req.params;

        let orgId = await authService.getOrganizerId(organizer)

        let result = await statsService.getGameList(orgId, eventId);
        res.send(result);
    })


    app.get("/stats/:organizer/:eventId/summary", async (req, res) => {
        const {
            organizer,
            eventId,
        } = req.params;
        const cacheKey = `stats:${organizer}-${eventId}-summary`;

        let message = await cache.getOrSet(cacheKey, async () => {
            let stats = await getStats(organizer, eventId, "overall");
            let body = "";
            if (stats.teams) {
                let message = stats.teams.map(team => `${team.name} ${team.overall_stats.score}`)
                body = message.join(", ");
            }
            return `${body} -- (after ${stats.total} games)`;
        }, 300)

        let settings = await settingService.getMatchSettings(organizer, eventId);
        let title = (settings && settings.title) || `${organizer} - ${eventId}`;

        res.send(`--- ${title} --- ${message}`);
    })

    app.get("/stats/:organizer/:eventId/stacked", async (req, res) => {
        const {
            organizer,
            eventId,
        } = req.params;
        const cacheKey = `stats:${organizer}-${eventId}-stacked`;

        let stats = await cache.getOrSet(cacheKey, async () => {
            return await getStats(organizer, eventId, "overall", true);
        }, 300)

        res.send(stats);
    })

    app.get("/stats/:organizer/:eventId/:game", async (req, res) => {
        const {
            organizer,
            eventId,
            game
        } = req.params;
        const cacheKey = `stats:${organizer}-${eventId}-${game}`;

        let stats = await cache.getOrSet(cacheKey, async () => {
            return await getStats(organizer, eventId, game);
        }, 300)

        res.send(stats);
    })

    app.delete("/stats/:organizer/:eventId/:game", verifyOrganizerHeaders, async (req, res) => {
        const {
            organizer,
            eventId,
            game
        } = req.params;

        await statsService.deleteStats(req.organizer.id, eventId, game);
        await deleteCache(organizer, eventId, game);

        res.sendStatus(200);
    })

    app.get("/stats/latest", async (req, res) => {
        const cacheKey = "latest";

        let cachedLatest = await cache.get(cacheKey);
        if (cachedLatest) {
            return res.send(cachedLatest);
        }

        let matches = await statsService.getLatest();
        let settings = await Promise.all(matches.map(async match => settingService.getMatchSettings(match.username, match.eventId)));

        if (matches) {
            let stats = matches.map((match, id) => {
                return {
                    id: match.id,
                    organizer: match.username,
                    eventId: match.eventId,
                    title: (settings[id] || {}).title,
                    top3: apexService.generateOverallStats(match.stats).slice(0, 3).map(team => team.overall_stats)
                }
            });

            cache.put(cacheKey, stats, 300);
            res.send(stats);
        }
    })


    app.get("/short_link", async (req, res) => {
        const url = req.query.url;
        let hash = await shortLinkService.getHash(url);

        if (!hash) {
            hash = await shortLinkService.createShortLink(url);
        }

        hash = SHORT_LINK_PREFIX + hash

        res.send({ hash });
    })

    app.get("/" + SHORT_LINK_PREFIX + "*", async (req, res) => {
        const hash = req.params[0];

        let url = await shortLinkService.getUrl(hash);
        if (url) {
            await shortLinkService.incrementVisit(hash);
            res.redirect(url);
        } else {
            res.sendStatus(404);
        }
    })


    app.get("/players", async (req, res) => {
        res.send(await playerService.listPlayers(req.query.start, req.query.count, req.query.search));
    })

    app.get("/player/:id", async (req, res) => {
        res.send(await playerService.getPlayer(req.params.id));
    })

    app.get("/player/:id/matches", async (req, res) => {
        res.send(await playerService.getMatches(req.params.id, req.query.start, req.query.count));
    })

    app.ws("/live/write/:key", (ws, req) => {
        wsHandlerService.connectWrite(ws, req.params.key, req.socket.remoteAddress);
    })

    app.ws("/live/read/:org", (ws, req) => {
        wsHandlerService.connectRead(ws, req.params.org);
    })

    app.ws("/live/test", (ws) => {
        console.log("Connected")
        ws.on("message", console.log);
    })


    // app.ws("/live/read/:organizer", (ws, req) => {
    //     liveService.connectRead(ws, req.params.organizer);
    // })


}