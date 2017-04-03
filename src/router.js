const express = require('express');
const path = require('path');
const glob = require('glob');
const winston = require('winston');

const expressRouter = express.Router();
const routeNames = [];

const router = (app) => {

    glob.sync(__dirname + '/routes/**/*.js').forEach((name) => {
        require(name)(app, expressRouter);
        routeNames.push(name);
    });

    winston.info(`Found and loaded ${routeNames.length} routes. (${routeNames.join(', ')})`);
    
    app.use('/v1/', expressRouter);
    
    expressRouter.use((req, res, next) => {
        res.status(404).json({ 
            message: 'not found.' 
        });
    });
}

module.exports = router;