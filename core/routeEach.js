const fs = require('fs');
const path = require('path');
const router = require('koa-router')()

const basePathG = path.join(__dirname, '../controller');
// const basePathG = path.join('controller');
let arrG = fs.readdirSync(basePathG);
let basePathStrG = '';




function routeEach(app, baseUrl, pathArr, basePathStr, basePath) {
    pathArr = pathArr ? pathArr : arrG;
    basePathStr = basePathStr ? basePathStr : basePathStrG;
    basePath = basePath ? basePath : basePathG;
    baseUrl = baseUrl || '';

    let i, length = pathArr.length;
    for(i = 0; i<length; i++){
        let pathStr = path.join(basePath,`${basePathStr}/${pathArr[i]}`);
        if(!isExists(pathStr)) {   //检查是否有该文件或者目录  没有就继续下一个循环
            continue;
        }
        if(isDir(pathStr)) {        //检查是不是文件夹
            let arr = fs.readdirSync(pathStr);
            routeEach(app, baseUrl, arr, `${basePathStr}/${pathArr[i]}`, basePath);
        }else {
            let str = "";
            if(pathArr[i] == 'index.js') {
                str = `${basePathStr}`;
            } else {
                str = `${basePathStr}/${pathArr[i].substring(0, pathArr[i].length - 3)}`;
            }
            let pageParams = Object.assign({
                page: async (ctx, next) => {ctx.body = '空白页哦'},
                method:"all",
                before:[],
                after:[function(ctx) {
                    ctx.throw(500);
                }]
            },require(pathStr));
            str = baseUrl + str;
            console.log(str);
            router[pageParams.method]( str, ...pageParams.before, pageParams.page, ...pageParams.after)
        }
    }
    app.use(router.routes(), router.allowedMethods())
}

function isExists(path){        //查看是否有该文件或目录
    if(fs.existsSync(path)) {
        return true;
    }
    return;
}

function isDir(path) {      //查看是不是文件夹
    if(fs.existsSync(path) && fs.statSync(path).isDirectory()) {  //先判断存在不存在  再判断文件类型，判断是不是文件夹
        return true;
    }
    return false;
}

module.exports = routeEach;
