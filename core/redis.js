const jwt = require('jwt-simple');
const CryptoJS = require('crypto-js');
const md5 = str => CryptoJS.MD5(str).toString().toUpperCase();
const redisConfig = require('~/config/redis.js');
const {secret} = require('~/config/common');
const redis = require('redis'),
    RDS_PORT = redisConfig.RDS_PORT,            // 服务器端口
    RDS_HOST = redisConfig.RDS_HOST,            // 服务器ip
    RDS_OPTS = redisConfig.RDS_OPTS,            // 设置值
    RDS_PWD = redisConfig.RDS_PWD,             // 密码
    client = redis.createClient({port: RDS_PORT, host: RDS_HOST, RDS_OPTS, password: RDS_PWD, db: 1}),
    client2 = redis.createClient({port: RDS_PORT, host: RDS_HOST, RDS_OPTS, password: RDS_PWD, db: 2});
    client3 = redis.createClient({port: RDS_PORT, host: RDS_HOST, RDS_OPTS, password: RDS_PWD, db: 3});

client.auth(RDS_PWD, function() {
    console.log('redis1认证通过');
});
client2.auth(RDS_PWD, function() {
    console.log('redis2认证通过');
});
client3.auth(RDS_PWD, function() {
    console.log('redis3通过认证');
});
client.on('error', function(err) {
    console.log('Error ' + err);
});
client.on('ready', function() {
    console.log('redis ok');
});
// 1.lpush
// 在key对应 list的头部添加字符串元素
//
// 2.rpush
// 在key对应 list 的尾部添加字符串元素
let redisFn = {
    common: {
        // 获取当前db中所有的key
        getdbnamelist: async() => {
            return new Promise((resolve, reject) => {
                // 相当于命令（keys *）, 返回list，包含当前db所有key的名字
                client.keys('*', function(err, val) {
                    if (err) {
                        resolve();      // 报错返回null
                    } else {
                        resolve(val);
                    }
                });
            });
        },
        // 添加list数据
        insertListInDB: async(dbname, dbdata) => {
            return new Promise((resolve, reject) => {
                client.rpush(dbname, dbdata, function(err) {
                    if (err) {
                        resolve();      // 报错返回null
                    } else {
                        resolve({dbdata, dbname});
                        // console.log('insert[%d] 个数据 in db[%s] finished',dbdata.length,dbname);
                    }
                });
            });
        },
        // 查询指定的key中，指定位置的内容
        querylistdata: async(dbname) => {
            return new Promise((resolve, reject) => {
                // 0 为起始位置，-1为最后的位置
                client.lrange(dbname, 0, -1, function(err, val) {
                    if (err) {
                        resolve();      // 报错返回null
                    } else {
                        resolve({val});
                    }
                });
            });
        },
        // 删除
        deletelistdata: async(dbname) => {
            return new Promise((resolve, reject) => {
                // 保留指定位置的内容，其他全部删除，所以从0到-1就是一个不删； 从-1到0就是数据全部删除，相当于del key
                client.ltrim(dbname, -1, 0, function(err, val) {
                    if (err) {
                        resolve();       // 报错返回null
                    } else {
                        resolve({val});
                    }
                });
            });

        },
        // 更新指定位置内容
        updatelist: async(dbname, dbdataindex, newinfo) => {
            return new Promise((resolve, reject) => {
                client.lset(dbname, dbdataindex, newinfo, function(err, val) {
                    if (err) {
                        resolve();       // 报错返回null
                    } else {
                        resolve({val});
                    }
                });
            });
        },
    },
    token: {
        /*
        * 用user换取JwtToken
        * source 指来源  pc、h5、app
        * */
        getJwtToken: async(user, source) => {
            user = Object.assign({}, user);
            source = source || 'pc';
            user.source = source;
            let date = new Date().getTime();
            let jwtToken = jwt.encode(user, secret + date) + date;
            return jwtToken;
        },
        /*
        * 用user换取token
        * source 指来源  pc、h5、app
        * */
        setToken: async(user, source) => {
            let jwtToken = await redisFn.token.getJwtToken(user, source);
            let token = md5(jwtToken);
            client.set(token, user.id + '-' + source);
            client.expire(token, 60 * 60 * 24 * 60);  //  缓存60天
            let obj = {};
            let field = source + '-' + token;
            obj[field] = jwtToken;
            client2.hmset(user.id, obj, (err, reply) => {   // 异步
                if (err) {
                    throw err;
                } else {
                    // 顶号操作，一个来源只允许一个账号登录
                    // eslint-disable-next-line handle-callback-err
                    client2.hgetall(user.id, (err, obj) => {
                        Object.keys(obj).forEach((key, index) => {
                            let keyArr = key.split('-');
                            let keySource = keyArr[0];
                            let keyToken = keyArr[1];
                            if (keySource == source && key != field) {
                                client.del(keyToken, client.print);
                                client2.hdel(user.id, key, client2.print);
                            }
                        });
                    });
                }
            });
            return token;
        },
        /*
        * 用user换取tokeon
        * source 指来源 pc、h5、app
        * */
        /*
        * 用admin的token
        * 用user换取token
        * source 指来源  pc、h5、app
        * */
        setAdminToken: async(user, source) => {
            let jwtToken = await redisFn.token.getJwtToken(user, source);
            let token = md5(jwtToken);
            client2.set(token, user.id + '-' + source);
            client2.expire(token, 60 * 60 * 24 * 30);  //  缓存30天
            let obj = {};
            let field = source + '-' + token;
            obj[field] = jwtToken;
            client.hmset(user.id, obj, (err, reply) => {   // 异步
                if (err) {
                    throw err;
                } else {
                    // 顶号操作，一个来源只允许一个账号登录
                    // eslint-disable-next-line handle-callback-err
                    client.hgetall(user.id, (err, obj) => {
                        Object.keys(obj).forEach((key, index) => {
                            let keyArr = key.split('-');
                            let keySource = keyArr[0];
                            let keyToken = keyArr[1];
                            if (keySource == source && key != field) {
                                client2.del(keyToken, client2.print);
                                client.hdel(user.id, key, client.print);
                            }
                        });
                    });
                }
            });
            return token;
        },
        /*
        * 用token换取admin的user
        * 若没有user则返回空
        * */
        getAdminUser: async(token) => {
            let userId = null;
            let source = null;
            let field = null;
            let jwtTokenStr = await new Promise(function(resolve, reject) {
                // eslint-disable-next-line handle-callback-err
                client2.get(token, (err, reply) => {
                    if (!reply) {
                        resolve('');
                        return;
                    }
                    let replyArr = reply.split('-');
                    userId = replyArr[0];
                    source = replyArr[1];
                    field = source + '-' + token;
                    // eslint-disable-next-line handle-callback-err
                    client.hget(userId, field, (err, reply) => {
                        resolve(reply ? reply : '');
                    });
                });
            });
            // console.log(jwtTokenStr);
            if (jwtTokenStr) {
                let jwtToken = jwtTokenStr.substring(0, jwtTokenStr.length - 13);
                let date = jwtTokenStr.substring(jwtTokenStr.length - 13, jwtTokenStr.length);
                let user = '';
                try {
                    user = jwt.decode(jwtToken, secret + date);
                    return user;
                } catch (err) {
                    if (userId) {    // 删除跟该token有关的值，得不到就删除,一般不会来到这里的
                        // console.log('得不到就删除，这是一个很大的bug，容易被攻击');
                        client2.del(token, client.print);
                        client.hdel(userId, field, client2.print);
                    }
                    return '';
                }
            } else {
                return '';
            }
        },
        /*
        * 更改用户信息
        * 用user重置下jwtToken的值
        * 更新成功则返回true
        * */
        reSetToken: async(user) => {
            await new Promise((resolve, reject) => {
                client2.hgetall(user.id, async(err, obj) => {
                    if (err) {
                        reject(err);
                    }
                    let keys = Object.keys(obj);
                    let i = 0, length = keys.length;
                    for (i; i < length; i++) {
                        let key = keys[i];
                        let keyArr = key.split('-');
                        let source = keyArr[0];
                        let jwtToken = await redisFn.token.getJwtToken(user, source);
                        let token = keyArr[1];
                        let obj = {};
                        let field = source + '-' + token;
                        obj[field] = jwtToken;
                        await new Promise((resolve2, reject2) => {
                            client2.hmset(user.id, obj, (err, reply) => {
                                if (err) {
                                    reject2(err);
                                } else {
                                    resolve2(true);
                                }
                            });
                        });

                    }
                    resolve(true);
                });
            });

            return true;
        },
        /*
        * 用token换取user
        * 若没有user则返回空
        * */
        getUser: async(token) => {
            let userId = null;
            let source = null;
            let field = null;
            let jwtTokenStr = await new Promise(function(resolve, reject) {
                // eslint-disable-next-line handle-callback-err
                client.get(token, (err, reply) => {
                    if (!reply) {
                        resolve('');
                        return;
                    }
                    let replyArr = reply.split('-');
                    userId = replyArr[0];
                    source = replyArr[1];
                    field = source + '-' + token;
                    // eslint-disable-next-line handle-callback-err
                    client2.hget(userId, field, (err, reply) => {
                        resolve(reply ? reply : '');
                    });
                });
            });
            // console.log(jwtTokenStr);
            if (jwtTokenStr) {
                let jwtToken = jwtTokenStr.substring(0, jwtTokenStr.length - 13);
                let date = jwtTokenStr.substring(jwtTokenStr.length - 13, jwtTokenStr.length);
                let user = '';
                try {
                    user = jwt.decode(jwtToken, secret + date);
                    return user;
                } catch (err) {
                    if (userId) {    // 删除跟该token有关的值，得不到就删除,一般不会来到这里的
                        // console.log('得不到就删除，这是一个很大的bug，容易被攻击');
                        client.del(token, client.print);
                        client2.hdel(userId, field, client2.print);
                    }
                    return '';
                }
            } else {
                return '';
            }
        },
        /*
       * 删除该adminid的所有token信息
       * 删除成功则返回true
       * */
        removeAdminToken: async(userId) => {
            try {
                // eslint-disable-next-line handle-callback-err
                client.hgetall(userId, (err, obj) => {
                    if (!obj) {
                        obj = [];
                    }
                    Object.keys(obj).forEach((key, index) => {
                        let token = key.split('-')[1];
                        client2.del(token, client.print);
                        client.hdel(userId, key, client2.print);
                    });
                });
                client.del(userId);
                return true;
            } catch (err) {
                // console.log(err);
                return false;
            }
        },
        /*
        * 删除该用户id的所有token信息
        * 删除成功则返回true
        * */
        removeToken: async(userId) => {
            try {
                // eslint-disable-next-line handle-callback-err
                client2.hgetall(userId, (err, obj) => {
                    if (!obj) {
                        obj = [];
                    }
                    Object.keys(obj).forEach((key, index) => {
                        let token = key.split('-')[1];
                        client.del(token, client.print);
                        client2.hdel(userId, key, client2.print);
                    });
                });
                client2.del(userId);
                return true;
            } catch (err) {
                // console.log(err);
                return false;
            }
        },
    }
};
module.exports = {
    client,
    client2,
    client3,
    ...redisFn,
};

