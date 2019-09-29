const redisConfig = require(global.__base + 'config/redis.js');
const redis = require('redis'),
    RDS_PORT = redisConfig.RDS_PORT,            // 服务器端口
    RDS_HOST = redisConfig.RDS_HOST,            // 服务器ip
    RDS_OPTS = redisConfig.RDS_OPTS,            // 设置值
    RDS_PWD = redisConfig.RDS_PWD,             // 密码
    client = redis.createClient({port: RDS_PORT, host: RDS_HOST, RDS_OPTS, password: RDS_PWD, db: 5}),
    client2 = redis.createClient({port: RDS_PORT, host: RDS_HOST, RDS_OPTS, password: RDS_PWD, db: 6}),
    client3 = redis.createClient({port: RDS_PORT, host: RDS_HOST, RDS_OPTS, password: RDS_PWD, db: 7});

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
};
module.exports = {
    client,
    client2,
    client3,
    ...redisFn,
};

