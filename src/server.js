global.Promise = require('bluebird');

const bodyParser = require('body-parser');
const http = require('http');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const winston = require('winston');
const connectWinston = require('express-winston');

const Redis = require('./database/redis');
const Postgres = require('./database/postgres');
const config = require('../config');
const router = require('./router');

const database = new Postgres();
const redis = new Redis();
const app = express();

// Database startup
database.start();
redis.start();

// Express setup
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

router(app);

app.use(connectWinston.logger({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: true
        })
    ],
    meta: false,
    msg: "Request: {{req.method}} @ {{req.url}}",
    expressFormat: true,
    colorize: true,
    ignoreRoute: function (req, res) { return false }
}));

app.use(connectWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: true
        })
    ]
}));

// Server setup
const port = config.port || 3000;
const server = http.createServer(app);
server.listen(port);

winston.info(`Rest server started on port ${port}.`);


