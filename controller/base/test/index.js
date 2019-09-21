const oauth = require(global.__base + 'middlewares/oauth');

const page = async(ctx, next) => {
    ctx.success(`${ ctx.name }，欢迎你来到我的冰火世界，你的名字，我是从中间件里获取的`);
};

module.exports = {
    page: page,
    method: 'get',    // 请求方式  get请求，post请求，all请求（全部请求）  默认all
    before: [oauth],      // 存放中间件
    after: []
};
