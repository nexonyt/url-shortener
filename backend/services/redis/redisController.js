const redisClient = require('./redisClient');

const redisController = {
    async set(key, value, ttl) {
        try {
            const stringValue = JSON.stringify(value);
            if (ttl) {
                await redisClient.set(key, stringValue, { EX: ttl });
            } else {
                await redisClient.set(key, stringValue);
            }
            return true;
        } catch (error) {
            return false;
        }
    },

    async get(key) {
        try {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            return null;
        }
    },

    async exists(key) {
        try {
            const result = await redisClient.exists(key);
            return result === 1;
        } catch (error) {
            return false;
        }
    },

    async delete(key) {
        try {
            await redisClient.del(key);
            return true;
        } catch (error) {
            return false;
        }
    }
};

module.exports = redisController;