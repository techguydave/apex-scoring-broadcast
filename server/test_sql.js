const { db } = require("./connectors/db");
const fs = require("fs");

const file = fs.readFileSync("../local/mock/mock.json");
const lines = file.toString().split("\n");
(async () => {
    let start = Date.now();
    for (let line of lines) {
        await db.raw(`
            UPDATE "test" 
            SET text = text || ?
            WHERE id = 18005
        `, [line])
        // console.log(line)
    }

    console.log("Finsihed", Date.now() - start, (Date.now() - start) / lines.length);
})()