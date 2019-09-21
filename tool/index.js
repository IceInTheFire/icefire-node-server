'use strict';
/**
 * 工具大全
 */
module.exports = {
    /**
     * 判断是否是手机号
     * 是则返回true
     * 否则返回false
     */
    isMobile,
    /**
     * 判断是否是obj
     * 判断msg是否是对象，并判断不是数组
     */
    isObject,
    /**
     * 判断是不是整数
     */
    isInt,
    /**
     * 删除对象里的空值
     */
    delEmptyKey,
    /**
     * 输出正确的sql语句
     * 如果是字符串的话，返回多加两个双引号
     * 如果不是，则照样返回
     */
    toSqlStr(str) {
        if (typeof str == 'string') {
            return `"${str}"`;
        } else {
            return str;
        }
    },
};

/**
 *
 * @param {object} obj
 * 删除对象里的空值
 */
function delEmptyKey(obj) {
    let result = {};
    /* Object.entries遍历键值对 */
    // let obj = { a: 1, b: 2, c: function () { } };
    // Object.entries(obj)//[['a',1],['b', 2], ['c',function]]返回对象键值对数组
    Object.entries(obj).forEach((value, index) => {
        if (value[1]) {
            result[value[0]] = value[1];
        }
    });
    return result;
}

/*
* 判断是否是obj
* 判断msg是否是对象，并判断不是数组
* */
function isObject(obj) {
    return (typeof obj == 'object' && !Array.isArray(obj));
}

/*
* 判断是否是手机号
* 是则返回true
* 否则返回false
*/
function isMobile(mobile) {
    return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(mobile);
}

/*
 * 判断是不是整数
 */
function isInt(str) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(str) == null || str == '') {
        return false;
    } else {
        return true;
    }
}
