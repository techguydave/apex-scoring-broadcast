const _ = require("lodash");
function patchData(data, patch) {
    patch.players.forEach(p => !p ? console.log(p) : data.players[p.nucleusHash] = p);
    data.feed.push(...patch.feed);

    delete patch.feed;
    delete patch.players;

    Object.keys(patch).forEach(k => data[k] = patch[k]);
}

function combindTeams(data) {
    data.teams = _.groupBy(data.players, "teamId");
}

function processWsData(ws, cb) {
    let data = { feed: [], players: [] };

    ws.addEventListener("open", () => ws.send(JSON.stringify({ type: "ldrqfull" })));

    ws.addEventListener('message', (event) => {
        let parsed = JSON.parse(event.data);
        //console.log(parsed);

        if (parsed.type === "ldfull" && parsed.body) {
            data = parsed.body;
        }
        else if (parsed.type === "lddiff") {
            patchData(data, parsed.body);
        }

        combindTeams(data);

        //console.log(JSON.stringify(data));
        cb({ ...data });
    });

}

module.exports = {
    processWsData,
}