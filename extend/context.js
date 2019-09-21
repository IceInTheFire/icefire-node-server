module.exports = {
    /**
     * 成功返回的格式
     * @param {*} data 返回的数据
     */
    success(data) {
        this.ctx.body = {
            code: 1000,
            data
        };
    },
    /**
     * 失败返回的格式
     * @param {*} errorMsg 返回的错误信息
     */
    error(errorMsg) {
        this.ctx.body = {
            code: 1002,
            data: null,
            msg: errorMsg || '',
        };
        // this.ctx.status = 402
    },
    toJSON(data, msg, code) {
        this.ctx.body = {
            code: code || 1000,
            data: data,
            msg: msg || ''
        };
        /*
        * code
        * 1000   请求接口成功
        * 1002   代码错误，前端直接显示报错信息
        * 1003   token验证失败，前端直接跳转到登录页
        * 1004   权限不够，前端直接跳转到首页
        * */
    }
};
