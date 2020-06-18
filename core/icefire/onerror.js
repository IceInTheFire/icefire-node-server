// const {accessLogger, systemLogger, accessErrorLogger, accessSimpleLogger} = require(global.__base + 'core/logger');
const {accessLogger, systemLogger, accessErrorLogger, accessSimpleLogger} = require('~/core/logger');

const handler = async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        let url = ctx.req.headers.host + ctx.req.url;
        ctx.response.status = err.statusCode || err.status || 500;
        // ctx.response.body = {
        //     message: err.message
        // };
        if(ctx.response.status == 404) {
            ctx.errorCode('NOTFOUND');     // 以后也可以自己渲染一个页面
        } else {
            // ctx.error(ctx.response.status + '，未知错误，请复制错误码' + new Date().getTime() + '联系我们');
            ctx.errorCode(err.message);
            // ctx.errorFn(ctx.response.status);
        }

        accessSimpleLogger.error(url + err);        // 简单记录报错
        accessErrorLogger.error(err);               // 报错详情

        // 手动释放error事件
        // ctx.app.emit('error', err, ctx);
        // ctx.app.emit('error');
        ctx.app.emit();
        // ctx.throw(500);
    }
};

module.exports = handler;
