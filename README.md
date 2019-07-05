## 冰火
基于koa2封装的node后台框架，一个强大、简单、粗暴、易用、自由、便捷的node框架。

#### 冰火初衷
```
搭建一个强大、简单、粗暴、易用、自由、便捷的node 后台框架。

拥有后台通用的mvc目录结构，舍弃egg繁琐的debug方式、约束、底层封装、第三方扩展插件再次封装、部署等缺点。

如果egg是企业级，那么我这个就是专属mysql的个人级后台。
```

#### 目录介绍
```$xslt
1、bin文件
    程序启动的地方
2、config配置文件
    mysql、redis、图片前缀等配置
3、controller控制器（不需要注明路由，文件名对应url路由名）
    module.exports = {
        page: page,
        method: "get",    // 请求方式  get请求，post请求，all请求（全部请求）
        before: [],      // 存放中间件
        after: []
    }
4、core文件夹（最好不要去更改它，本架构的最核心之处）
    实现了本架构的功能
    4.1、定义了ctx.tool
    4.2、定义了ctx.params获取参数的方法，（icefire/getParams.js）
    4.3、页面报错拦截、输出并log打印的功能（icefire/onerror.js）
    4.4、控制器文件名对应路由名的功能（routeEach.js）
    4.5、log日志打印输出切割功能（logger.js）
    4.6、mysql数据库连接并定义到ctx.db（db.js）
    4.7、redis连接功能并定义到ctx.redis（redis）
    4.8、service对应service方法的实现功能
5、extend文件
    contenxt.js定义了一些常用的方法  支持this.ctx
6、logs日志文件
    存放程序log日志
7、middlewares中间件
8、models数据库模型
    mysql数据库模型，通过`node auto`生成
9、public静态文件
    静态图片、静态js、静态css存放的地方
10、service服务层
    专门写业务代码
    service下不支持多个文件夹嵌套
11、sql文件
    本示例代码的sql文件
12、tool工具
    封装了常用的工具方法
    使用方式 ctx.tool
13、views视图层
    这里采用的是pug语法，
    若想用ejs语法的话，可去app.js里更改成ejs语法
14、app.js
    本程序的开始
15、auto.js
    生成模型的方法
```

#### ctx方法
```
    ctx.db.(数据库表名，首字母大写).findAll   采用的是sequelize库。
    ctx.redis.对象名.方法          redis方法
    ctx.tool        工具类方法
    ctx.success     extend文件夹内定义的
    ctx.error       extend文件夹内定义的
    ctx.toJSON      extend文件夹内定义的
```
#### 跑项目之前
1、下载依赖
```
yarn
```
2、生成模型
```
yarn model
```
#### 开发环境
```
yarn dev
```
#### 部署
```
yarn model
pm2 start bin/api.js
```

#### 请求地址
```
http://localhost:3001/api/base?name=123
http://localhost:3001/api/base/index2
http://localhost:3001/api/base/index3
```
