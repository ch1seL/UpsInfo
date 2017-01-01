var CronJob = require('cron').CronJob;
var Mail = require('./mail');
var UpsInfo = require('./upsinfo');
var db = require('./db/db')
var settings = require('./settings.json')

const alertTemp = settings["alertTemp"] || 22;
const minSmsIntervalMinutes = settings["minSmsIntervalMinutes"] || 10;

function OnTick() {
    UpsInfo.get(function (oids) {
        if (oids.epm_temperature > alertTemp) {
            db.lastMailSend().exec(function (err, docs) {
                if (err != null) console.log('Ошибка получения последней даты ' + err);
                else {
                    //Рассылка СМС не чаще раза в minSmsIntervalMinutes
                    diffMinutes = Math.round((new Date().getTime() - new Date(docs[0].date).getTime()) / 60000);
                    oids.mailsend = ((docs[0] == undefined) || (diffMinutes >= minSmsIntervalMinutes)) ? true : false;

                    if (oids.mailsend) Mail.send(oids.epm_temperature);
                    db.insert(oids);
                }
            });
        }
        else
            db.insert(oids);
    })
}

module.exports.Job = new CronJob({
    cronTime: settings["cronTime"] || '00 * * * * *',
    onTick: OnTick(),
    start: true,
    timeZone: 'Europe/Samara'
});