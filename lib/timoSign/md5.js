const CryptoJS = require('crypto-js');
const md5 = str => CryptoJS.MD5(str).toString().toUpperCase();

module.exports = md5;