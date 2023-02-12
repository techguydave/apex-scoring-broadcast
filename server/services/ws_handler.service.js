const { db } = require("../connectors/db");
const _ = require("lodash");
const redis = require("../connectors/redis");
const authService = require("./auth.service");

const sockets = {};



function connectWrite(ws) {
    console.log("New Websocket Connect")
    let organizer;
    let hostname;

    ws.sendMsg = function (type, body) {
        let msg = JSON.stringify({ type, body });
        console.log("Sending ", msg)
        this.send(msg);
    }

    ws.on("message", async msg => {
        console.log(msg);
        let parsed = JSON.parse(msg);
        let type = parsed.type;
        let body = parsed.body;

        if (type == "auth") {
            let organizer = await authService.getOrganizer(body.username, body.key);
            if (organizer) {
                console.log("Auth Accepted for " + organizer.username)
                ws.sendMsg("auth_accepted")
                organizer = organizer;
                hostname = body.hostname;
            } else {
                ws.sendMsg("auth_denied")
            }
        }
    })
}



module.exports = {
    connectWrite
}