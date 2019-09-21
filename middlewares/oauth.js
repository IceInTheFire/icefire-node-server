let oauth = async(ctx, next) => {
    ctx.name = '冰火';
    await next();
};

module.exports = oauth;
