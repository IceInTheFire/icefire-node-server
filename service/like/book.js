class bookService{
    async get(){
        const { ctx } = this;
        return `你好，我的世界不欢迎你啊，${ctx.name}`
    }
}


module.exports = bookService;
