const tool = require(global.__base + 'tool');
const db = require(global.__base + 'core/db');
const redis = require(global.__base + 'core/redis');

let base = async(ctx, next) => {
    ctx.db = db;
    ctx.redis = redis;
    ctx.tool = tool;
    await next();
};

module.exports = base;
