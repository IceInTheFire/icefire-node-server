
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('~/core/db');
const extend = require('~/extend/context');
const path = require('path');
const glob = require('glob');   // 读取本地的.js格式文件，

let defaultOptions = {
    serviceRoot: path.join(process.cwd(), 'service/'),
    extendRoot: path.join(process.cwd(), 'extend/'),
};

function selfish(target, ctx) {
    const cache = new WeakMap();    // 弱引用。
    const handler = {
        get(target, key) {
            const value = Reflect.get(target, key);
            if (typeof value !== 'function') {
                return value;
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind({ctx}));
            }
            return cache.get(value);
        }
    };
    const proxy = new Proxy(target, handler);
    return proxy;
}
/*
* 将url地址转换为对象
*
* 比如
* 将这么一段数组
* [
    "Book/getBook.js",
    "index.js",
    "like/like2.js",
    "like/like/like2.js"
   ];
   转成下面这种格式
    {
        Book:{
         getBook:require("Book/getBook.js"),
        },
        index:require("index.js"),
        like:{
            like2:require("like/like2.js"),
            like:{
                like2:require("like/like/like2.js")
            }
        }
    }
*
*   serviceRoot   根目录
*   files url地址格式
*   cacheMap 将要赋值的地址
*
*   return cacheMap;
* */
const urlToObj = (serviceRoot, files) => {
    let cacheMap = {};
    files.forEach((value, index) => {
        let valueArr = value.split('/');
        let length = valueArr.length;
        valueArr[length - 1] = valueArr[length - 1].substring(0, valueArr[length - 1].length - 3);  // 数组最后一个，去掉.js
        let cacheMapNow = cacheMap;
        let i = 0;
        for (i; i < length - 1; i++) {
            let value2 = valueArr[i];
            if (cacheMapNow[value2] === undefined) {
                cacheMapNow[value2] = {};
            }
            cacheMapNow = cacheMapNow[value2];
        }
        let value2 = valueArr[length - 1];
        cacheMapNow[value2] = require(`${serviceRoot}/${value}`);
    });

    return cacheMap;
};

let ctx = {
    db,
    ...extend,
};

let service = (options) => {
    options = options || {};
    options = Object.assign({}, defaultOptions, options);
    const files = glob.sync('**/*.js', {nodir: true, cwd: options.serviceRoot});
    let cacheMap = urlToObj(options.serviceRoot, files);
    let handler = {
        get: function(target, name) {
            if (typeof target[name] == 'object') {
                return new Proxy(target[name], handler);
            } else {
                let service = selfish(new (target[name])(), ctx);
                return service;
            }
        }
    };
    return new Proxy(cacheMap, handler);
}

ctx.service = service({
    serviceRoot: path.join(process.cwd(), 'service/'),
});

module.exports.ctx = ctx;
