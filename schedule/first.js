const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const schedule = require('node-schedule');

const {ctx} = require('~/core/ctx');

let rule = new schedule.RecurrenceRule();
rule.hour = 0;    // 0点
rule.minute = 0;  // 0分
rule.second = 0;  // 0秒
const {accessLogger, systemLogger, accessErrorLogger, accessSimpleLogger} = require('~/core/logger');

module.exports = {
    interval: rule,
    async handler() {
        try {
            console.log('每天定时0点0分0秒打印')
        } catch (err) {
            // console.log(err);
            accessErrorLogger.error(err);               // 报错详情
        }
    }
};
