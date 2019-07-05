class baseService{
    async get(){
        const { ctx } = this;
        return '你好，我的世界不欢迎你'
    }
    async getData(){
        const { ctx } = this;

        let result = await ctx.db.User.findAll({
            attributes: ['name', 'id', 'age', 'sex']
        });
        return result;
    }
    async redisInsert(){
        const { ctx } = this;
        let result = await ctx.redis.common.insertListInDB('冰火','你好，我的伙伴');
        return result;
    }
    async redisGet(){
        const { ctx } = this;
        let keys = await ctx.redis.common.getdbnamelist();
        let result = [];
        for(let key of keys) {      // for of 性能较慢， 真实项目。建议用for循环或者foreach循环
            let obj = {};
            obj[key] = await ctx.redis.common.querylistdata(key);
            result.push(obj);
        }
        return result;
    }
}


module.exports = baseService;
