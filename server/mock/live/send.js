const livedata = require("./livedata.json");
const Websocket = require("websocket").w3cwebsocket;
const ws = new Websocket("ws://localhost:3000/live/write/key1");

function wait(time) {
    return new Promise((res) => {
        setTimeout(() => res(), time);
    })
}

ws.onopen = async function () {
    let start = livedata[0].timestamp;
    await wait(500);
    await Promise.all(livedata.map(async (line, count) => {
        //        await wait((line.timestamp - start) * 200);
        await wait(count * 1);

        ws.send(JSON.stringify(line));
    }));
    console.log("done");
}

ws.onerror = () => console.log("Client DC")

ws.onclose = () => console.log("Closed");
