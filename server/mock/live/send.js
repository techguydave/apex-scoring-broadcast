const livedata = require("./livedata.json");
const Websocket = require("websocket").w3cwebsocket;
// const ws = new Websocket("ws://localhost:3000/live/write/key1/Drews Client");
const ws = new Websocket("wss://dev.overstat.gg/api/live/write/UTl5UyJE8sn3p3Bb01j6JjdVVZ4ukjRx/sdf");

function wait(time) {
    return new Promise((res) => {
        setTimeout(() => res(), time);
    })
}

ws.onopen = async function () {
    let start = livedata[0].timestamp;
    await wait(500);
    await Promise.all(livedata.map(async (line, count) => {
        await wait((line.timestamp - start) * 100);
        // await wait(count)

        ws.send(JSON.stringify(line));
    }));
    console.log("done");
}

ws.onerror = (msg) => console.log("Client DC", msg)

ws.onclose = (msg) => console.log("Closed", msg);
