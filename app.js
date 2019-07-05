global.__base = __dirname + '/';        //设置全局require目录前缀
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
// const json = require('koa-json')
const bodyparser = require('koa-bodyparser');       //获取post请求的参数

const icefire = require('./core/icefire/');

const {  accessLogger, systemLogger, accessErrorLogger } = require('./core/logger');
const compress = require('koa-compress');   //压缩
const helmet = require("koa-helmet");       //安全
const favicon = require('koa-favicon');     //favicon
const routeEach = require('./core/routeEach');


app.use(bodyparser());

icefire(app);
app.use(accessLogger()); //中间件
/*
* 压缩
* */
const options = {threshold: 2048};
app.use(compress(options));


app.use(helmet());
// app.use(json())

// app.use(require('koa-static')(__dirname + '/public'))

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(views(__dirname + '/views', {
    extension: 'pug'
}))


// logger
// app.use(async (ctx, next) => {
//     const start = new Date()
//     await next()
//     const ms = new Date() - start
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

routeEach(app, '/api');     // 路由地址


// error-handling
app.on('error', (err, ctx) => {
    systemLogger.error(err);
});
// app.on('error', err => {systemLogger.error(err); });

module.exports = app
