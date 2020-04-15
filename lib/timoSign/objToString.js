const objToString = (params) => {
    let paramsStr = '';
    let paramsKey = '';
    let keys = Object.keys(params).sort();
    keys.forEach((key, index) => {
        paramsKey += key;
        if(typeof params[key] == 'object') {
            paramsStr += objToString(params[key]) + '';
        } else {
            paramsStr += params[key] + '';
        }
    });
    return paramsKey + paramsStr;
}
module.exports = objToString;