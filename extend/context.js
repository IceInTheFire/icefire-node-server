const error = require('~/config/error.js');

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
            // data: null,
            msg: errorMsg || '',
        };
    },
    errorCode(errorCode) {
        this.ctx.body = error[errorCode] || {
            code: '10500',
            msg: '未知错误，请复制错误码' + new Date().getTime() + '联系我们'
        };
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
    },

    exclude: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
    },
    /*
    * 下面都是时间 start
    * */
    toMonthFirst(paramsTime) { // 获取本月1号 0:00:00 000 的时间戳
        let time;
        if (paramsTime && new Date(paramsTime)) {
            time = new Date(new Date(paramsTime).setDate(1)).setHours(0, 0, 0, 0);
        } else {
            time = new Date(new Date().setDate(1)).setHours(0, 0, 0, 0);
        }
        return time;
    },
    toMonthCount(paramsTime) { // 获取本月天数
        var date;

        if (paramsTime && new Date(paramsTime)) {
            date = new Date(paramsTime);
        } else {
            date = new Date();
        }
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = new Date(year, month, 0);
        return d.getDate();
    },
    toDayCount(paramsTime) {  // 今天是本月的第几天
        if (paramsTime && new Date(paramsTime)) {
            return new Date().getDate(paramsTime);
        }
        return new Date().getDate();
    },
    BeforeSevenDayStart() { // 获取六天前的 0:00:00 000  // 六日前的0点。。比如今天是30号，也就是获取24号的0点。
        // 获取今日0点
        let time = new Date().setHours(0, 0, 0, 0);
        let beforeSevenTime = time - 60 * 60 * 24 * 1000 * 6;
        return beforeSevenTime;
    },
    toDayStart() {  // 获取今日0:00:00 000
        // 获取今日0点
        let time = new Date().setHours(0, 0, 0, 0);
        return time;
    },
    toDayEnd() {    // 获取今日23:59:59 999
        // 获取今日0点
        let time = new Date().setHours(0, 0, 0, 0);
        let endTime = time + 60 * 60 * 24 * 1000 - 1;      // 今日23:59:59
        return endTime;
    },
    /*
      * 下面都是时间 end
      * */
    /*
    * 定时任务实例存储
    * */
    schedule: {

    },
    getClientIP(request) {
        const {req} = request;
        // return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        //     req.headers['x-real-ip'] ||
        //     req.headers.referer ||
        //     req.headers.host;
        return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
    }
};
