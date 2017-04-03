const { Sequelize } = require('sequelize');
const winston = require('winston');

const { db } = require('../../config.json');
const database = new Sequelize(db, {logging: false});

module.exports = class Database {

    /**
     * get db()
     * @description Getter for PostgreSQL database.
     */
    get db() {
        return database;
    }

    /**
     * start()
     * @description Starts PostgreSQL Connection
     */
    start() {
        database.authenticate()
            .then(() => winston.info('Connected to PostgreSQL Database.'))
			.then(() => database.sync())
			.then(() => winston.info('Database synced'))
            .catch((err) => winston.error(`PostgreSQL Error: ${err}`));
    }

}