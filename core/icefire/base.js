const tool = require(__base + 'tool');
const db = require(__base + 'core/db');
const redis = require(__base + 'core/redis');

let base = async (ctx, next)=>{
    ctx.db = db;
    ctx.redis = redis;
    ctx.tool = tool;
    await next();
}

module.exports = base;
