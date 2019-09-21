// 测试
module.exports = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'timotaoke',
    multipleStatements: true,  // 是否允许执行多条sql语句
    // insecureAuth: true,   // 加入此项可解决此错误！！！  //使用旧（不安全）的连接方式去连接MySQL  远程连接
    // debug: true,            //是否把连接情况打印到文件里

    subTable: true,              // 是否分表  项目一旦决定是true和false后，就不可在更改了，否则数据错乱概不负责
    stepCount: {    // 在subTable为true下成立
        user: 10            // 当user表的自增长id大于10时，则分表 测试
    }
};

