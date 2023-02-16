const livedata = require("./livedata.json");
const Websocket = require("websocket").w3cwebsocket;
const ws = new Websocket("ws://localhost:3000/live/write/key1");

function wait(time) {
    return new Promise((res) => {
        setTimeout(() => res(), time * 1000);
    })
}

ws.onopen = async function () {
    let start = livedata[0].timestamp;

    livedata.forEach(async line => {
        await wait(line.timestamp - start);
        ws.send(JSON.stringify(line));
    })
}

ws.onerror = () => console.log("Client DC")

ws.onclose = () => console.log("Closed");