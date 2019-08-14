const {  accessLogger, systemLogger, accessErrorLogger, accessSimpleLogger } = require(__base + 'core/logger');

const handler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        let url = ctx.req.headers.host + ctx.req.url;
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
        accessSimpleLogger.error(url + err);        // 简单记录报错
        accessErrorLogger.error(err);               // 报错详情
        console.log(err);

        // 手动释放error事件
        // ctx.app.emit('error', err, ctx);
        // ctx.app.emit('error');
        ctx.app.emit();
        // ctx.throw(500);
    }
};


module.exports = handler;
