const { db } = require("../connectors/db");
const _ = require("lodash");
const redis = require("../connectors/redis");
const authService = require("./auth.service");

const sockets = {};

function processData(organizer, eventId, data) {

}


function connectWrite(ws, organizerName) {
    console.log("New Websocket Connect")
    let organizer;
    let eventId;
    ws.on("message", async msg => {
        let parsed = JSON.parse(msg);
        let command = parsed.cmd;
        let body = parsed.body;

        if (command == "auth") {
            organizer = await authService.getOrganizer(organizerName, body);
            if (organizer) {
                
                ws.send(JSON.stringify({ success: "auth" }))
            } else {
                ws.send(JSON.stringify({ failed: "auth" }))
            }
        } else if (organizer) {
            if (command == "set.event") {
                eventId = body;
                ws.send(JSON.stringify({ success: "event" }))
            }
            else if (command == "data.live") {
                if()
            }
            else {
                ws.send(JSON.stringify({ failed: "cmd" }))
            }
        } else {
            ws.send(JSON.stringify({ failed: "auth" }))
        }
    })
}



module.exports = {
    connectWrite
}