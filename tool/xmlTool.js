const xml2js = require('xml2js');

const xml = {
    xmlToJson: (str) => {
        return new Promise((resolve, reject) => {
            const parseString = xml2js.parseString;
            parseString(str, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    xmlToJsonObj: (str) => {
        return new Promise((resolve, reject) => {
            const parseString = xml2js.parseString;
            parseString(str, { explicitArray : false, ignoreAttrs : true }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    jsonToXml: (obj) => {
        const builder = new xml2js.Builder();
        return builder.buildObject(obj);
    }
};

module.exports = xml;
