const oauth = require(__base + 'middlewares/oauth');
const page = async (ctx, next) => {
    let { name, sex, age, id } = ctx.params;  // 获取参数
    ctx.success(await ctx.service.test.findAndCountAll({name, sex, age, id }));
}






module.exports = {
    page: page,
    method: "get",    // 请求方式  get请求，post请求，all请求（全部请求）  默认all
    before: [oauth],      // 存放中间件
    after: []
}
