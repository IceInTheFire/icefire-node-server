const md5 = require('./md5.js');
const objToString = require('./objToString');
const getSign = ({ data, name, key }) => {
    let params = Object.assign({}, data);
    let {token} = params;
    delete params.token;
    let paramsStr = objToString(params);
    let timestamp = new Date().getTime();
    let sign = null;
    if (token) {
        sign = md5(`${name + key + token + timestamp + paramsStr}`);
    } else {
        sign = md5(`${name + key + timestamp + paramsStr}`);
    }

    return Object.assign({}, data, {
        sign, timestamp
    });
};

module.exports = getSign;
