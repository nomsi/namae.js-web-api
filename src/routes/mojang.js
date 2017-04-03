const Promise = require('bluebird');
const request = require('request-promise');
const winston = require('winston');

const Redis = require('../database/redis');
const redis = new Redis();

module.exports = (app, router) => {

    const mojangPath = 'https://api.mojang.com/users/profiles/minecraft';
    const historyPath = 'https://api.mojang.com/user/profiles';

    // Convert Username->UUID
    router.get('/mojang/:username/convert', (req, res, next) => {
        redis.db.get(req.params.username, (err, data) => {
            if (data !== null) {
                redis.db.get(req.params.username, (err, reply) => {
                    res.send({
                        'uuid': reply,
                        'username': req.params.username
                    });
                });
            } else {
                request(`${mojangPath}/${req.params.username}`)
                    .then((data) => {
                        let _data = JSON.parse(data);
                        res.send({
                            'uuid': _data.id,
                            'username': _data.name
                        });
                        redis.db.set(_data.name, _data.id);
                }).catch((err) => winston.error(`${err}`));
            }
        });
    });

    // Player history
    router.get('/mojang/:uuid/history', (req, res, next) => {
        redis.db.get(`history.${req.params.uuid}`, (err, data) => {
            if (data !== null) {
                redis.db.get(`history.${req.params.uuid}`, (err, reply) => {
                    console.log(data);
                    res.send(JSON.parse(reply));
                });
            } else if (data == null) {
                console.log(`${historyPath}/${req.params.uuid}/names`);
                request(`${historyPath}/${req.params.uuid}/names`)
                    .then((data) => {
                        res.send(JSON.parse(data));
                        redis.db.set(`history.${req.params.uuid}`, JSON.stringify(JSON.parse(data)));
                    }).catch((err) => winston.error(`${err}`));
            }
        });
    });
}