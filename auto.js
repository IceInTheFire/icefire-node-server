global.__base = __dirname + '/';        // 设置全局require目录前缀
require('best-require')(process.cwd());  // 添加require里的~/功能
const SequelizeAuto = require('sequelize-auto');
const config = require('~/config/sql');
const fs = require('fs');

delDir(global.__base + 'models');     // 先删除
const auto = new SequelizeAuto(
    config.database, config.user, config.password, {
        host: config.host,
        dialect: 'mysql',
        directory: './models', // prevents the program from writing to disk
        port: config.port,
        additional: {
            timestamps: config.timestamp,
            paranoid: config.paranoid,
            // autoIncrement: true,
            // 要将表里的 deletedAt 设置为 destroyTime (注意要启用paranoid)
            // deletedAt: 'destroyTime',
        }
    }
);

// 删除文件夹
function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + '/' + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); // 递归删除文件夹
            } else {
                fs.unlinkSync(curPath); // 删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

auto.run(function(err) {
    if (err) {
        throw err;
    }
    // console.log(auto.tables); // table list
    // console.log(auto.foreignKeys); // foreign key list

    // 生成models表后，直接执行项目
    // require('./bin/api');
});
