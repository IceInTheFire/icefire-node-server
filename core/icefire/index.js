const base = require('./base');             // db、redis、和常用中间件的
const service = require('./service');       // 封装 service 和extend的中间件
const getParams = require('./getParams');   // 获取参数的中间件
const onerror = require('./onerror');       // 页面报错检测的中间件
const path = require("path");




module.exports = (app) => {
    app.use(base);
    app.use(getParams);
    app.use(service({
        // serviceRoot: path.join(__dirname, 'service'),
        serviceRoot: path.join(__base, 'service')
    }))
    app.use(onerror);   // 页面的错误机制
}
