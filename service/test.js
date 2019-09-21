class testService {
    async insert({name, age, sex}) {
        const {ctx} = this;
        let result = await ctx.db.User.create({
            name, age, sex,
        });
        return result;
    }

    async findAll({name, sex, age, id}) {
        const {ctx} = this;
        let result = null;
        let options = {
            attributes: ['name', 'id', 'age', 'sex'],
            where: {}
        };
        name ? options.where.name = name : '';
        sex ? options.where.sex = sex : '';
        age ? options.where.age = age : '';
        id ? options.where.id = id : '';
        /*
                * 分表写法 start
                * */
        if (id) { // 若id有值，则可以用sequelize的方式，
            result = await ctx.db.User.findAll(options);
        } else {    // 若无值
            delete options.where.id;
            result = await ctx.db.tool.findAll({ctx, tableName: 'user', options});
        }
        /*
         * 分表写法 end
         * */
        /*
        * 非分表写法 start
        * 用sequelize的方式，
        * */
        // result = await ctx.db.User.findAll(options);
        /*
        * 非分表写法 end
        * */

        return result;
    }

    async findAndCountAll({name, sex, age, id}) {
        const {ctx} = this;
        let result = null;
        let options = {
            attributes: ['name', 'id', 'age', 'sex'],
            where: {}
        };
        name ? options.where.name = name : '';
        sex ? options.where.sex = sex : '';
        age ? options.where.age = age : '';
        id ? options.where.id = id : '';
        /*
                * 分表写法 start
                * */
        if (id) { // 若id有值，则可以用sequelize的方式，
            result = await ctx.db.User.findAndCountAll(options);
        } else {    // 若无值
            delete options.where.id;
            result = await ctx.db.tool.findAndCountAll({ctx, tableName: 'user', options});
        }
        /*
         * 分表写法 end
         * */
        /*
        * 非分表写法 start
        * 用sequelize的方式，
        * */
        // result = await ctx.db.User.findAndCountAll(options);
        /*
        * 非分表写法 end
        * */

        return result;
    }

    async findOne({name, sex, age, id}) {
        const {ctx} = this;
        let result = null;
        let options = {
            attributes: ['name', 'id', 'age', 'sex'],
            where: {}
        };
        name ? options.where.name = name : '';
        sex ? options.where.sex = sex : '';
        age ? options.where.age = age : '';
        id ? options.where.id = id : '';
        /*
                * 分表写法 start
                * */
        if (id) { // 若id有值，则可以用sequelize的方式，
            result = await ctx.db.User.findOne(options);
        } else {    // 若无值
            result = await ctx.db.tool.findOne({ctx, tableName: 'user', options});
        }
        /*
         * 分表写法 end
         * */
        /*
        * 非分表写法 start
        * 用sequelize的方式，
        * */
        // result = await ctx.db.User.findAll(options);
        /*
        * 非分表写法 end
        * */

        return result;
    }

    async update({name, sex, age, id}) {
        const {ctx} = this;

        let options = [{
            name, sex, age
        }, {
            where: {}
        }];
        id ? options[1].where.id = id : '';
        let result = null;
        /*
        * 分表写法 start
        * */
        if (id) { // 若id有值，则可以用sequelize的方式，
            result = await ctx.db.User.update(...options);
        } else {    // 若无值
            result = await ctx.db.tool.update({ctx, tableName: 'user', options});
        }
        /*
         * 分表写法 end
         * */
        /*
        * 非分表写法 start
        * 用sequelize的方式，
        * */
        // result = await ctx.db.User.update(...options);
        /*
        * 非分表写法 end
        * */
        return result;
    }

    async del({name, sex, age, id}) {
        const {ctx} = this;
        // let result = await ctx.db.tool.destroy({ ctx, tableName:'user', options: {
        //         where:{
        //             name: '你好'
        //         }
        //     }});
        let options = {
            where: {}
        };
        name ? options.where.name = name : '';
        sex ? options.where.sex = sex : '';
        age ? options.where.age = age : '';
        id ? options.where.id = id : '';
        let result = null;
        /*
        * 分表写法 start
        * */
        if (id) { // 若id有值，则可以用sequelize的方式，
            result = await ctx.db.User.destroy(options);
        } else {    // 若无值
            result = await ctx.db.tool.destroy({ctx, tableName: 'user', options});
        }
        /*
         * 分表写法 end
         * */
        /*
        * 非分表写法 start
        * 用sequelize的方式，
        * */
        // result = await ctx.db.User.destroy(options);
        /*
        * 非分表写法 end
        * */
        return result;
    }

    async redisInsert() {
        const {ctx} = this;
        let result = await ctx.redis.common.insertListInDB('冰火', '你好，我的伙伴');
        return result;
    }

    async redisGet() {
        const {ctx} = this;
        let keys = await ctx.redis.common.getdbnamelist();
        let result = [];
        for (let key of keys) {      // for of 性能较慢， 真实项目。建议用for循环
            let obj = {};
            obj[key] = await ctx.redis.common.querylistdata(key);
            result.push(obj);
        }
        return result;
    }
}

module.exports = testService;
