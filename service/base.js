class baseService{
    async get(){
        const { ctx } = this;
        return '我是从service里获取的'
    }
}


module.exports = baseService;
