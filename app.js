global.__base = __dirname + '/';        // 设置全局require目录前缀
require('best-require')(process.cwd());  // 添加require里的~/功能

const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
// const json = require('koa-json')
const bodyparser = require('koa-bodyparser');       // 获取post请求的参数
const {accessLogger, systemLogger, accessErrorLogger} = require('~/core/logger');
const icefire = require('~/core/icefire/');

const compress = require('koa-compress');   // 压缩
const helmet = require('koa-helmet');       // 安全
const favicon = require('koa-favicon');     // favicon
// const routeEach = require(global.__base + 'core/routeEach');
const routeEach = require('~/core/routeEach');

app.use(bodyparser());

icefire(app);
app.use(accessLogger()); // 中间件
/*
* 压缩
* */
const options = {threshold: 2048};
app.use(compress(options));

app.use(helmet());
// app.use(json())
// 静态资源托管
app.use(require('koa-static-server')({rootDir: __dirname + '/public', rootPath: '/public'}));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(views(__dirname + '/views', {
    extension: 'pug'
}));

routeEach(app, '/api');     // 路由地址

app.use((ctx, next) => {
    ctx.error('没有该页面');
    ctx.response.status = 404;
});

// error-handling
app.on('error', (err, ctx) => {
    systemLogger.error(err);
});
// app.on('error', err => {systemLogger.error(err); });

module.exports = app;
