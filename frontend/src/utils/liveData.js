const _ = require("lodash");
function patchData(data, patch) {
    patch.players.forEach(p => !p ? console.log(p) : data.players[p.nucleusHash] = p);
    patch.players.forEach(o => !o ? console.log(o) : data.players[o.nucleusHash] = o);

    data.feed.push(...patch.feed);

    delete patch.feed;
    delete patch.players;
    delete patch.observers;

    Object.keys(patch).forEach(k => data[k] = patch[k]);
}

function combindTeams(data) {
    data.teams = _.groupBy(data.players, "teamId");
    Object.values(data.teams).forEach(team => {
        team.teamId = team[0].teamId;
        team.name = team[0].teamName;
        team.kills = team.reduce((k, c) => k + c.kills, 0)
        team.score = team.kills;
    })
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
        cb({ ...data });
    });

}

module.exports = {
    processWsData,
}