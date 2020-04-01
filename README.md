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
#### mysql操作介绍（数据库分表）
```
    config文件夹下的sql.js
        subTable属性：是否分表的选项。
            true：为分表。（水平分表，根据id分表，当id超过百万时，分表）
                service文件夹下的base.js里增删改查是分表的增删改查写法
            false：为普通的sequelize写法，

        stepCount属性：在subTable为true下有用
            水平分表是当表的自增长id大于多少时则分表，默认是百万。
            stepCount是为了自定义每张表自增长id大于多少时分表，
            注：正式开发时把user去掉。

        timestamp属性：这个参数为true是MySQL会自动给每条数据添加createdAt和updateAt字段。createdAt和updateAt需要我们自己在新建表时定义（sequelize的字段）

        paranoid属性：设置 deletedAt 字段，当删除一条记录的时候，并不是真的销毁记录，而是通过该字段来标示，即保留数据，进行假删除，默认为false   仅在timestamp启用下使用。  deletedAt需要我们自己在新建表时定义（sequelize的字段）

    注：
    step表是标识分表用的，切忌不能删除，一删，分表就出问题了。
    每新增一张表的时候，设置字段自增长id，还要在step表里加上新增表的名称并赋值为0
```
#### 跑项目之前
0、环境配置
```
    将sql文件夹下的sql文件导入到mysql的timotest表里。
    配置好config文件夹下的mysql和redis文件
```
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
# 普通页面测试地址请求
http://localhost:3001/api/base/test/
http://localhost:3001/api/base/test/index2
http://localhost:3001/api/base/test/index3
http://localhost:3001/api/base/test/index4

# mysql测试页面地址请求
#### 增
http://localhost:3001/api/base/test/dbInsert?name=冰火&age=15&sex=1     # 若在config/sql.js里subTable为true且stepCount对象下的user为10，则访问该地址十多次二十多次，可看到数据库里分表。

#### 查
http://localhost:3001/api/base/test/dbFindAndCountAll
http://localhost:3001/api/base/test/dbFindAll
http://localhost:3001/api/base/test/dbFindOne?id=2

#### 改
http://localhost:3001/api/base/test/dbUpdate?id=2&name=冰火
#### 删
http://localhost:3001/api/base/test/dbDel?id=2
http://localhost:3001/api/base/test/dbDel?name=%E9%BB%98%E8%AE%A4

# redis请求地址
http://localhost:3001/api/base/test/redisInsert
http://localhost:3001/api/base/test/redisGet
```
#### API接口规范
```
     /*
    * code
    * 1000   请求接口成功
    * 1002   提示错误信息，前端直接显示报错信息
    * 1003   token验证失败，前端直接跳转到登录页
    * 1004   权限不够，前端直接跳转到首页
    * */
```
# 请求接口成功的code码是1000， data是数据
```
{
  "code": 1000,
  "data": "冰火，欢迎你来到我的冰火世界，你的名字，我是从中间件里获取的"
}
```
# 请求接口失败的code码是1002， msg是错误提示
```
{
  "code": 1002,
  "msg": "500，未知错误，请复制错误码1585724000253联系我们"
}
```
# token验证的code码是1003， msg是错误提示
```
{
  "code": 1003,
  "msg": "登录信息失效，请重新登录"
}
```
# 权限不足的code码是1004， msg是权限不足提示
```
{
  "code": 1004,
  "msg": "你没有该权限"
}
```
