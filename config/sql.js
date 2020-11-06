// 测试
module.exports = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'timotest',
    multipleStatements: true,  // 是否允许执行多条sql语句
    // insecureAuth: true,   // 加入此项可解决此错误！！！  //使用旧（不安全）的连接方式去连接MySQL  远程连接
    // debug: true,            //是否把连接情况打印到文件里
    timestamp: true,        // 这个参数为true是MySQL会自动给每条数据添加createdAt和updateAt字段
    paranoid: true,          // 设置 deletedAt 字段，当删除一条记录的时候，并不是真的销毁记录，而是通过该字段来标示，即保留数据，进行假删除，默认为false   仅在timestamp启用下使用
};
