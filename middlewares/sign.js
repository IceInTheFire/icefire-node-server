const { checkSign,getSign } = require('~/lib/timoSign/');
const { pcName, pcKey } = require('~/config/common');
const host = require('~/config/host');
let sign = async (ctx, next)=>{
    let name = null;
    let key = null;
    if(host.pc.indexOf(ctx.host) != -1) {
        name = pcName;
        key = pcKey;
    }
    if(!name || !key) {
        ctx.status = 404;
        ctx.error('总有刁民想害朕');
        return;
    }
    // console.log(ctx.params);
    // console.log(getSign({data: ctx.params,name,key}));
    if(checkSign({data: ctx.params, name, key})) {
        await next();
    } else {
        ctx.status = 404;
        ctx.error('服务器驳回请求，该请求已被记录。');
    }
};

module.exports = sign;
