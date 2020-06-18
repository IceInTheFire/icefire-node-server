
module.exports = {
    'NOTFOUND': {
        code: '10404',
        msg: '没有该页面'
    },
    'NOERROR': {
        code: '10500',
        msg: '未知错误'
    },
    'Illegal Buffer': {
        code: '10001',
        msg: 'encryptedData或iv失效'
    },
    'NOTLOGIN': {
        code: '1003',
        msg: 'token验证失败，前端直接跳转到登录页'
    },
    'SKUGOODSNOTARRAY': {
        code: '100500',
        msg: 'sukGoods不是一个字符串数组'
    },
    'NODATANOUPDATE': {
        code: '100312',
        msg: '没有该数据，修改失败'
    },
    'GOODSNOTARRAY': {
        code: '100501',
        msg: 'goods不是一个字符串数组'
    },
    'SKUJSONNOTARRAY': {
        code: '100502',
        msg: 'skuJson不是一个字符串数组'
    },
    'refundMoneyFAILNOMONEY': {
        code: '100444',
        msg: '确认取消失败，失败原因：余额不足'
    },
    'NOPHONE': {
        code: '10086',
        msg: '该用户尚未授权手机号，请授权'
    }
}
