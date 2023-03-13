import axios from "axios";

export default {
    install(Vue, options) {
        Vue.prototype.$apex = apexService(options);
    }
}

function getApiKeyHeaders() {
    return {
        "x-organizer-key": localStorage.getItem("organizer-key"),
        "x-organizer-name": localStorage.getItem("organizer-username"),
    }
}



function apexService(config) {

    function getApiKey() {
        return localStorage.getItem("organizer-key");
    }

    async function login(username, key) {
        let result = await axios.post(`${config.baseUrl}auth/organizer`, { username, key });

        return result.data;
    }

    async function getStatsFromCode(statsCode) {
        let stats = await axios.get(`${config.baseUrl}stats/code/${statsCode}`, { headers: getApiKeyHeaders() });
        return stats.data;
    }

    async function getStats(organizer, eventId, game) {
        let stats = await axios.get(config.baseUrl + "stats/" + organizer + "/" + eventId + "/" + game);
        return stats.data;
    }

    async function getGameList(organizer, eventId) {
        let stats = await axios.get(config.baseUrl + "games/" + organizer + "/" + eventId);
        return stats.data;
    }

    async function generateStats(eventId, statsCode, game, startTime, killPoints, placementPoints, autoAttachUnclaimed, selectedUnclaimed, liveData) {
        let form = new FormData();

        form.append("eventId", eventId);
        form.append("statsCode", statsCode);
        form.append("game", game);
        form.append("killPoints", killPoints);
        form.append("placementPoints", placementPoints);
        if (startTime)
            form.append("startTime", startTime);
        form.append("autoAttachUnclaimed", autoAttachUnclaimed);
        form.append("selectedUnclaimed", selectedUnclaimed);
        form.append("liveData", liveData);

        try {
            let result = await axios.post(config.baseUrl + "stats", form, { headers: getApiKeyHeaders() })
            return result.data;
        } catch (err) {
            return err.response.data;
        }

    }

    async function deleteStats(organizer, eventId, game) {
        await axios.delete(config.baseUrl + "stats/" + organizer + "/" + eventId + "/" + game, { headers: getApiKeyHeaders() });
    }

    async function getBroadcastSettings(organizer) {
        let data = await axios.get(config.baseUrl + "settings/broadcast/" + organizer);
        return data.data;
    }

    async function setBroadcastSettings(organizer, display) {
        await axios.post(config.baseUrl + "settings/broadcast/" + organizer, display, { headers: getApiKeyHeaders() });
    }

    async function getPublicSettings(organizer, eventId) {
        let data = await axios.get(config.baseUrl + "settings/match/" + organizer + "/" + eventId);
        return data.data;
    }

    async function setPublicSettings(organizer, eventId, display) {
        await axios.post(config.baseUrl + "settings/match/" + organizer + "/" + eventId, display, { headers: getApiKeyHeaders() });
    }

    async function setSelectedMatch(organizer, match) {
        await axios.post(config.baseUrl + "settings/match/" + organizer, { match }, { headers: getApiKeyHeaders() });
    }

    async function getSelectedMatch(organizer) {
        let { data } = await axios.get(config.baseUrl + "settings/match/" + organizer, { headers: getApiKeyHeaders() });
        return data.selected_match;
    }

    async function setOrganizerDefaultApexClient(organizer, client) {
        await axios.post(config.baseUrl + "settings/default_apex_client/" + organizer, { client }, { headers: getApiKeyHeaders() });
    }

    async function getOrganizerDefaultApexClient(organizer) {
        let { data } = await axios.get(config.baseUrl + "settings/default_apex_client/" + organizer, { headers: getApiKeyHeaders() });
        return data.selected_apex_client;
    }


    async function getMatchList(organizer) {
        let result = await axios.get(config.baseUrl + "settings/match_list/" + organizer, { headers: getApiKeyHeaders() });
        return result.data;
    }

    async function getLatest() {
        let data = await axios.get(config.baseUrl + "stats/latest");
        return data.data;
    }

    async function getShortLink(url) {
        let data = await axios.get(config.baseUrl + "short_link?url=" + url);
        return data.data;
    }

    async function getLiveData(organizer, eventId, game) {
        let data = await axios.get(`${config.baseUrl}stats/${organizer}/${eventId}/${game}/livedata`);
        return data.data;
    }

    async function getUnclaimedLiveData() {
        let data = await axios.get(`${config.baseUrl}stats/unclaimed_livedata`, { headers: getApiKeyHeaders() });
        return data.data;
    }

    async function getPlayers(start, count, search) {
        let data = await axios.get(`${config.baseUrl}players?start=${start}&count=${count}&search=${search}`);
        return data.data;
    }

    async function getPlayer(id) {
        let data = await axios.get(`${config.baseUrl}player/${id}`);
        return data.data;
    }

    async function getPlayerMatches(id, start, count) {
        let data = await axios.get(`${config.baseUrl}player/${id}/matches?start=${start}&count=${count}`);
        return data.data;
    }

    async function createMatch(name) {
        let data = await axios.post(`${config.baseUrl}match/${name}`, {}, { headers: getApiKeyHeaders() });
        return data.data;
    }

    let connections = {};
    function getLiveDataWs(organizer, client) {
        const name = organizer + ":" + client;
        if (!connections[name]) {
            connections[name] = new WebSocket(`${config.wsUrl}live/read/${organizer}/${client}`);
            connections[name].onclose = () => {
                connections[name] = undefined
            };
        }
        return connections[name];
    }

    async function getClients(organizer) {
        let data = await axios.get(`${config.baseUrl}live/clients/${organizer}`);
        return data.data;
    }

    async function addClient(client) {
        let data = await axios.post(`${config.baseUrl}live/clients/`, { client }, { headers: getApiKeyHeaders() });
        return data.data;
    }



    return {
        config,
        getApiKey,
        getStats,
        generateStats,
        getBroadcastSettings,
        setBroadcastSettings,
        getPublicSettings,
        setPublicSettings,
        getMatchList,
        getSelectedMatch,
        setSelectedMatch,
        getStatsFromCode,
        login,
        getGameList,
        deleteStats,
        getLatest,
        getShortLink,
        getLiveData,
        getPlayers,
        getPlayer,
        getPlayerMatches,
        getLiveDataWs,
        getUnclaimedLiveData,
        getClients,
        setOrganizerDefaultApexClient,
        getOrganizerDefaultApexClient,
        addClient,
        createMatch,
    }
}