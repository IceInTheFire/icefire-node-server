const path = require('path')
const glob = require('glob');   //读取本地的.js格式文件，


let defaultOptions = {
    serviceRoot: path.join(process.cwd(), 'service/'),
    extendRoot: path.join(process.cwd(), 'extend/'),
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
         getBook:require("getBook.js"),
        },
        index:require("index.js"),
        like:{
            like2:require("like2.js"),
            like:{
                like2:require("like2.js")
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
function urlToObj(serviceRoot, files, cacheMap){
    files.forEach((value, index) => {
        let valueArr = value.split("/");
        if(valueArr.length <= 1) {
            let name = valueArr[0].substring(0,valueArr[0].length-3);       //去掉最后的.js
            cacheMap[name] = require(serviceRoot + '/' + valueArr[0]);
        } else if(valueArr.length == 2) {
            let name = valueArr[0];
            let name2 = valueArr[1].substring(0,valueArr[1].length-3);       //去掉最后的.js
            if(cacheMap[name] === undefined){   //如果全等于undefined
                cacheMap[name] = {};
            }
            cacheMap[name][name2] = require(serviceRoot + '/' +  name + '/' +  name2);
        }
        // else if(valueArr.length == 3) {
        //     let name = valueArr[0];
        //     let name2 = valueArr[1];
        //     let name3 = valueArr[2].substring(0,valueArr[2].length-3);       //去掉最后的.js
        //     if(cacheMap[name] === undefined){   //如果全等于undefined
        //         cacheMap[name] = {};
        //     }
        //     cacheMap[name][name2][name3] = require(serviceRoot + '/' +  name + '/' +  name2 + '/' + name3);
        // }
        else {
            let name = valueArr.splice(0,1);
            let filesArr = valueArr.join("/");
            if(cacheMap[name] === undefined){   //如果全等于undefined
                cacheMap[name] = {};
            }
            cacheMap[name] = Object.assign(cacheMap[name], urlToObj(serviceRoot+'/'+name, filesArr, cacheMap[name]));
        }
    })
    return cacheMap;
}


let service = (options) => {
    options = options || {}
    options = Object.assign({}, defaultOptions, options)
    const files = glob.sync('**/*.js', { nodir: true, cwd: options.serviceRoot })
    let cacheMap = urlToObj(options.serviceRoot,files,{});
    // console.log(cacheMap);
    let serviceMiddleWare = async (ctx, next) => {
        let handler = {
            get: function(target, name) {
                if(typeof target[name] == 'object') {
                    return new Proxy(target[name], handler);
                } else{
                    let service = selfish(new (target[name])(), ctx);
                    return service;
                }
            }
        };
        ctx.service = new Proxy(cacheMap, handler);

        /*
        * 种下 extend里的方法start
        * */
        let extend = require(options.extendRoot+'context.js');
        ctx.extend = selfish(extend, ctx);
        Object.assign(ctx, ctx.extend);
        delete ctx.extend;
        /*
        * 种下 extend里的方法end
        * */

        await next();
    }

    return serviceMiddleWare
}


function selfish (target, ctx) {
    const cache = new WeakMap();
    const handler = {
        get (target, key) {
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





module.exports = service;
