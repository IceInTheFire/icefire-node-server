const oauth = require(__base + 'middlewares/oauth');
const page = async (ctx, next) => {
    let { name = '默认', sex = 1, age = 20 } = ctx.params;  // 获取参数
    ctx.success(await ctx.service.test.insert({name, sex, age}));
}






module.exports = {
    page: page,
    method: "get",    // 请求方式  get请求，post请求，all请求（全部请求）  默认all
    before: [oauth],      // 存放中间件
    after: []
}
