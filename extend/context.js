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
        * 1002   提示错误信息，前端直接显示报错信息
        * 1003   token验证失败，前端直接跳转到登录页
        * 1004   权限不够，前端直接跳转到首页
        * */
    },
    /*
    * 专供于service返回信息
    * */
    toData({isSuccess = false, data = null, msg = null} = {}) {
        return {isSuccess, data, msg};
    },
    /*
    * 专供于service返回成功信息
    * */
    toSuccess(data) {
        return {isSuccess: true, data};
    },
    /*
     * 专供于service返回失败信息
     * */
    toError(msg) {
        return {isSuccess: false, msg};
    }
};
