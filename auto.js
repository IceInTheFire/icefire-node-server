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

auto.run(function (err) {
    if (err) {
        throw err;
    }
    console.log(auto.tables); // table list
    console.log(auto.foreignKeys); // foreign key list
    replaceAutoIncrement();      // mysql为 5.8以上时 需要打开注释
    // 生成models表后，直接执行项目
    // require('./bin/api');
});
/*
* 修复mysql8下生成模型的错误
* */
function replaceAutoIncrement() {
// 遍历statics文件夹，
    fs.readdir('./models', function(err, files) {
        if (err) {
            return err;
        }
        if (files.length != 0) {
            files.forEach((item) => {
                let path = './models/' + item;
                // 判断文件的状态，用于区分文件名/文件夹
                fs.stat(path, function(err, status) {
                    if (err) {
                        return err;
                    }
                    let isFile = status.isFile();// 是文件
                    let isDir = status.isDirectory();// 是文件夹
                    if (isFile) {
//                         replaceFile(path, `id: {
// \t\t\ttype: DataTypes.INTEGER(10),
// \t\t\tallowNull: false,
// \t\t\tprimaryKey: true
// \t\t},`, `id: {
// \t\t\ttype: DataTypes.INTEGER(10),
// \t\t\tallowNull: false,
// \t\t\tprimaryKey: true,
// \t\t\tautoIncrement: true
// \t\t},`);
//                         replaceFile(path, ` id: {
//                         type: DataTypes.INTEGER,
//                         allowNull: false,
//                         primaryKey: true
//                 },`, ` id: {
//                         type: DataTypes.INTEGER,
//                         allowNull: false,
//                         primaryKey: true,
//                         autoIncrement: true
//                 },`)

                        replaceFile(path, `primaryKey: true`,`primaryKey: true,autoIncrement: true` )
                    }
                    if (isDir) {
                        console.log('文件夹：' + item);
                    }
                });
            });
        }
    });
}

// 读取文件，并且替换文件中指定的字符串
let replaceFile = function(filePath, sourceRegx, targetStr) {
    fs.readFile(filePath, function(err, data) {
        if (err) {
            return err;
        }
        let str = data.toString();
        str = str.replace(sourceRegx, targetStr);
        fs.writeFile(filePath, str, function(err) {
            if(err) return err;
            console.log('更改了' + filePath);
        });
    });
}

