const Promise = require('bluebird');
const redis = require('redis');
const winston = require('winston');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({ db: '2' });

module.exports = class Redis {

    /**
     * get db()
     * @description Getter for PostgreSQL database.
     */
    get db() {
        return client;
    }

    /**
     * start()
     * @description Starts Redis Connection
     */
    start() {
        client.on('error', (err) => winston.error(`Redis error: ${err}`));
        client.on('reconnecting', () => winston.warn('Redis reconnecting...'));
    }

}