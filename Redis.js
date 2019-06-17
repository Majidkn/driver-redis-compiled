"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const core_1 = require("@vesta/core");
class Redis {
    constructor(config) {
        this.config = config;
    }
    connect() {
        if (this.connection)
            return Promise.resolve(this);
        return new Promise((resolve, reject) => {
            let client = redis_1.createClient(this.config.port, this.config.host, { password: this.config.password });
            client.on('ready', () => {
                this.connection = client;
                resolve(this);
                console.log('Redis connection established');
            });
            client.on('error', (error) => {
                reject(error);
                console.log('Redis Error', error);
            });
            client.on('reconnecting', () => {
                console.log('Redis connection established');
            });
        });
    }
    close(connection) {
        return Promise.reject(false);
    }
    find(key) {
        return new Promise((resolve, reject) => {
            this.connection.get(key, (err, reply) => {
                let result = {};
                result.items = [];
                if (err)
                    return reject(new core_1.DatabaseError(core_1.Err.Code.DBInsert, err));
                if (reply) {
                    try {
                        result.items = [JSON.parse(reply)];
                    }
                    catch (e) {
                        result.items = [reply];
                    }
                }
                resolve(result);
            });
        });
    }
    insert(key, value) {
        return new Promise((resolve, reject) => {
            this.connection.set(key, value, (err) => {
                if (err)
                    return reject(new core_1.DatabaseError(core_1.Err.Code.DBInsert, err.message));
                resolve();
            });
        });
    }
    update(key, value) {
        return this.insert(key, value);
    }
    remove(key) {
        return new Promise((resolve, reject) => this.connection.del(key, ((err, res) => {
            if (err)
                return reject(new core_1.DatabaseError(core_1.Err.Code.DBDelete, err.message));
            resolve();
        })));
    }
}
exports.Redis = Redis;
