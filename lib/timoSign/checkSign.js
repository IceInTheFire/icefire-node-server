const md5 = require('./md5.js');
const objToString = require('./objToString');
const checkSign = ({ data, name, key }) => {
    let params = Object.assign({}, data);
    let { token, sign, timestamp } = params;
    delete params.token;
    delete params.sign;
    delete params.timestamp;
    let paramsStr = objToString(params);
    let checkSign = null;
    if (token) {
        checkSign = md5(`${name + key + token + timestamp + paramsStr}`);
    } else {
        checkSign = md5(`${name + key + timestamp + paramsStr}`);
    }
    return checkSign == sign;
};

module.exports = checkSign;