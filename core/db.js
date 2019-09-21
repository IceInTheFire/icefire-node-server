const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require(global.__base + 'config/sql');
const {sqlLog} = require(global.__base + 'core/logger');

const basePathG = path.join(global.__base, 'models');

let models = fs.readdirSync(basePathG);
let stepDb = null;
const stepObj = config.stepCount;

dbInit();
/*
* 返回首字母大写
* */
const returnTableName = (str) => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
};

/*
* 检查是否有该表
* 有表则不操作
* 没表则新增一个表
* 若isCreat为false并无该表，则直接返回fileName
* */
const checkOrCreat = async({tableName, fileName, sequelize, idCount, isCreat}) => {
    // 如果该表未定义就创建表 并且是新增模式下
    if (!sequelize.isDefined(tableName) && isCreat) {
        // 获取模型的字符串
        let modelStr = fs.readFileSync(basePathG + `/${fileName}.js`, 'utf-8');

        // 替换模型的名称和表名
        modelStr = modelStr.replace(`sequelize.define('${fileName}'`, `sequelize.define('${tableName}'`).replace(`tableName: '${fileName}',`, `tableName: '${tableName}',`);

        // 创建模型文件
        fs.writeFileSync(basePathG + `/${tableName}.js`, modelStr, 'utf-8');

        // 引入并定义模型
        await sequelize.import(basePathG + `/${tableName}.js`);
        // 同步模型到数据库
        await sequelize.sync();
        // 更改自增值
        await sequelize.query(`alter table ${tableName} auto_increment=${idCount};`);
        return tableName;
    }
    else {
        return fileName;
    }
};

/*
* 获取id、table
* 判断并返回是第几个表
*
* fileName 是表名
* id是表的id
*
* */
const getTableNum = async({fileName, sequelize, id, isCreat}) => {
    let tableCount = 0, setpCount = 1000000;
    if (!isCreat) { // 查询，修改，删除
        setpCount = stepObj[fileName] || 1000000; // 一个表存在多少id
        tableCount = Math.ceil((id) / setpCount);    // 表的数量
    } else {    // 新增表获取会用到
        const step = await stepDb.findOne({
            attributes: [fileName]
        });
        let stepLength = step[fileName];    // 步长数量
        setpCount = stepObj[fileName] || 1000000; // 一个表存在多少id
        tableCount = Math.ceil((stepLength + 1) / setpCount);    // 表的数量
    }
    let tableName = fileName + (tableCount <= 1 ? '' : tableCount);
    tableName = await checkOrCreat({
        tableName,
        fileName,
        sequelize,
        idCount: setpCount * (tableCount - 1) + 1,
        isCreat
    });

    return tableName;
};

async function dbInit() {
    let sequelize = await new Sequelize(
        config.database,
        config.user,
        config.password,
        {
            'dialect': 'mysql', // 数据库使用mysql
            'host': config.host, // 数据库服务器ip
            'port': config.port, // 数据库运行端口
            'timestamp': false, // 这个参数为true是MySQL会自动给每条数据添加createdAt和updateAt字段
            'quoteIdentifiers': true,
            // logging: (message) => {sqlLog.info(message)}
        },
    );

    if (config.subTable) {
        const tool = {
            // 查询有多少个这样的分表
            getTableCount: async(tableName) => {
                let tables = (await sequelize.query(`SELECT table_name FROM information_schema.TABLES WHERE table_name like '${tableName}%' and TABLE_SCHEMA = '${config.database}';`))[0];
                let tablesArr = [];
                tables.forEach((value, index) => {
                    let tableName = value.table_name;
                    tablesArr.push(returnTableName(tableName));  // 首字母大写
                });
                return tablesArr;
            },
            findOne: async({ctx, tableName, options}) => {
                console.log(tableName);
                let tables = await tool.getTableCount(tableName);
                console.log(tables);
                let result = null;
                for (let value of tables) {
                    result = await ctx.db[value].findOne(options);
                    if (result) {
                        break;
                    }
                }
                return result;
            },
            findAll: async({ctx, tableName, options}) => {
                let tables = await tool.getTableCount(tableName);
                let result = [];
                let pArr = [];
                for (let value of tables) {
                    pArr.push(ctx.db[value].findAll(options));
                }
                let proResult = await Promise.all(pArr);
                proResult.forEach((value, index) => {
                    result.push(...value);
                });
                return result;
            },
            findAndCountAll: async({ctx, tableName, options}) => {
                let tables = await tool.getTableCount(tableName);
                let result = {
                    count: 0,
                    rows: []
                };
                let pArr = [];
                for (let value of tables) {
                    pArr.push(ctx.db[value].findAndCountAll(options));
                }
                let proResult = await Promise.all(pArr);
                proResult.forEach((value, index) => {
                    result.count += value.count;
                    result.rows.push(...value.rows);
                });
                return result;
            },
            update: async({ctx, tableName, options}) => {
                let tables = await tool.getTableCount(tableName);
                let result = 0;
                let pArr = [];
                for (let value of tables) {
                    pArr.push(ctx.db[value].update(...options));
                }
                let proResult = await Promise.all(pArr);
                proResult.forEach((value, index) => {
                    result += value[0];
                });
                return result;
            },
            destroy: async({ctx, tableName, options}) => {
                let tables = await tool.getTableCount(tableName);
                let result = 0;
                let pArr = [];
                for (let value of tables) {
                    pArr.push(ctx.db[value].destroy(options));
                }
                let proResult = await Promise.all(pArr);
                proResult.forEach((value, index) => {
                    result += value;
                });
                return result;
            }
        };
        module.exports.tool = tool;
    }

    models.forEach((item, index) => {
        let fileName = item.substr(0, item.length - 3);
        let name = returnTableName(fileName);   // 首字母大写

        let dbName = require(basePathG + `/${item}`)(sequelize, Sequelize.DataTypes);

        module.exports[name] = dbName;

        if (item == 'step.js') { // 记录每个表的id数量
            stepDb = dbName;
            return;
        }
        if (!config.subTable) {
            return;
        }
        // find请求之前
        dbName.addHook('beforeFind', async(Instance, options, next) => {
            if (Instance.where && Instance.where.id) {
                dbName.tableName = await getTableNum({fileName, sequelize, id: Instance.where.id});
            }
        });
        dbName.addHook('afterFind', async(Instance, options) => {
            dbName.tableName = fileName;
        });
        // dbName.addHook('beforeValidate', async (Instance, options) => {
        //     dbName.tableName = await getTableNum({ fileName, sequelize });
        // });
        //
        // dbName.addHook('afterValidate', async (Instance, options) => {
        // });

        // 修改请求之前
        dbName.addHook('beforeBulkUpdate', async(Instance, options) => {
            if (Instance.where && Instance.where.id) {
                dbName.tableName = await getTableNum({fileName, sequelize, id: Instance.where.id});
            }
        });

        // 修改请求之后
        dbName.addHook('afterBulkUpdate', async(Instance, options) => {
            dbName.tableName = fileName;
        });

        // 删除请求之前
        dbName.addHook('beforeBulkDestroy', async(Instance, options) => {
            if (Instance.where && Instance.where.id) {
                dbName.tableName = await getTableNum({fileName, sequelize, id: Instance.where.id});
            }
        });

        // 删除请求之后
        dbName.addHook('afterBulkDestroy', async(Instance, options) => {
            dbName.tableName = fileName;
        });

        // 新增请求之前
        dbName.addHook('beforeCreate', async(Instance, options) => {
            dbName.tableName = await getTableNum({fileName, sequelize, isCreat: true});
        });

        // 新增请求之后
        dbName.addHook('afterCreate', async(Instance, options, fn) => {
            let data = {};
            data[fileName] = Instance.id;
            await stepDb.update(data, {where: {}});  // 更改步长标识

            // tableName改回来
            dbName.tableName = fileName;
        });
    });
}






