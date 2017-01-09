var CronJob = require('cron').CronJob;
var Mail = require('./mail');
var UpsInfo = require('./upsinfo');
var db = require('./db/db')
var settings = require('./settings.json')

const alertTemp = settings["alertTemp"] || 22;
const alertHumMin = settings["alertHumMin"] || 20;
const alertHumMax = settings["alertHumMax"] || 50;
const minSmsIntervalMinutes = settings["minSmsIntervalMinutes"] || 10;

var OnTick = function OnTick() {
    UpsInfo.get(function(oids) {
        if ((oids.epm_temperature >= alertTemp) || (oids.epm_humidity >= alertHumMax) || (oids.epm_humidity <= alertHumMin)) {
            console.log(oids.epm_temperature + '>=' + alertTemp, oids.epm_humidity + '>=' + alertHumMax, oids.epm_humidity + '<=' + alertHumMin);
            db.lastMailSend().exec(function(err, docs) {
                if (err != null) console.log('Ошибка получения последней даты ' + err);
                else {
                    //Рассылка СМС не чаще раза в minSmsIntervalMinutes                    
                    oids.mailsend = ((docs[0] == undefined) || (docs[0].date == undefined) || (Math.round((Date.now() - docs[0].date) / 60000) >= minSmsIntervalMinutes)) ? true : false;

                    if (oids.mailsend) Mail.send(oids.epm_temperature, oids.epm_humidity);
                    db.insert(oids);
                }
            });
        } else
            db.insert(oids);
    })
}

module.exports.Job = new CronJob({
    cronTime: settings["cronTime"] || '00 * * * * *',
    onTick: OnTick,
    start: true,
    timeZone: 'Europe/Samara'
});