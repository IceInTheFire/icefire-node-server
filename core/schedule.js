const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

// 自动扫指定目录下面的文件并且加载
function scanFilesByFolder(cb) {
    const _folder = path.join(process.cwd(), 'schedule/');
    try {
        const files = fs.readdirSync(_folder);
        files.forEach((file) => {
            let filename = file.replace('.js', '');

            let oFileCnt = require(_folder + '/' + filename);

            cb && cb(filename, oFileCnt);
        });

    } catch (error) {
        // console.log('文件自动加载失败...', error);
    }
}

// 加载定时任务
function initSchedule() {
    scanFilesByFolder((filename, scheduleConf) => {
        // console.log(filename);
        // console.log(scheduleConf);
        schedule.scheduleJob(scheduleConf.interval, scheduleConf.handler);
    });
}

module.exports = initSchedule;
