const tool = require('~/tool');
const db = require('~/core/db');
const redis = require('~/core/redis');

let base = async(ctx, next) => {
    ctx.db = db;
    ctx.redis = redis;
    ctx.tool = tool;
    await next();
};

module.exports = base;
