
const express = require('express')
const router = require("./routes/router");
const cors = require("cors");
const history = require('connect-history-api-fallback');
const app = express()
const port = 3000;
const { db } = require("./connectors/db");
const redis = require("./connectors/redis");
const expressWs = require("express-ws");
(async () => {
    if (!await redis.isConnected()) {
        console.error("Could not connect to redis");
        return;
    }
    db.migrate.latest();

    // middleware
    app.use(express.json());
    app.use(cors());
    expressWs(app);

    router(app);

    const staticFileMiddleware = express.static('dist');

    app.use(staticFileMiddleware);

    app.use(history({
        index: 'index.html'
    }));

    app.use(staticFileMiddleware);

    app.listen(port, () => {
        console.log(`Your app is running at http://localhost:${port}`)
    })

    process.on('uncaughtException', function (err) {
        console.log(err);
    })
})();
