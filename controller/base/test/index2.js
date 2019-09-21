const page = async(ctx, next) => {
    ctx.toJSON(`${ ctx.name }，欢迎你来到我的冰火世界`);
};

module.exports = {
    page: page,
    method: 'get',    // 请求方式  get请求，post请求，all请求（全部请求）  默认all
    before: [],      // 存放中间件
    after: []
};
