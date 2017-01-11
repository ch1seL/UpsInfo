var CronJob = require('cron').CronJob;
var Mail = require('./mail');
var UpsInfo = require('./upsinfo');
var db = require('./db')

/**
 * Removes a module from the cache
 */
function purgeCache(moduleName) {
    // Traverse the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function(mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName) > 0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * Traverses the cache to search for all the cached
 * files of the specified module name
 */
function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse(mod) {
            // Go over each of the module's children and
            // traverse them
            mod.children.forEach(function(child) {
                traverse(child);
            });

            // Call the specified callback providing the
            // found cached module
            callback(mod);
        }(mod));
    }
};

var OnTick = function OnTick(test) {
    purgeCache('./settings.json');

    var settings = require('./settings.json');

    if (this.cronTime.source != (settings.cronTime || '00 * * * * *')) {
        this.stop();
        new CronJob({
            cronTime: settings.cronTime || '00 * * * * *',
            onTick: OnTick,
            start: true,
            timeZone: 'Europe/Samara'
        });
    }

    UpsInfo.get(function(oids) {
        if (oids.error === undefined && ((oids.epm_temperature >= settings.alertTemp || 22) || (oids.epm_humidity >= settings.alertHumMax || 60) || (oids.epm_humidity <= settings.alertHumMin || 20))) {
            db.lastMailSend().exec(function(err, docs) {
                if (err != null) console.log('Ошибка получения последней даты ' + err);
                else {

                    var minSmsIntervalMinutes = settings.minSmsIntervalMinutes || 10;
                    var minSmsIntervalMinutesIfTempNotIncrease = settings.minSmsIntervalMinutesIfTempNotIncrease || 60;

                    //отправим почту если запись в бд не найдена                    
                    oids.mailsend = (docs[0] == undefined) || (docs[0].date == undefined);
                    oids.mailsend = oids.mailsend || (Math.round((Date.now() - docs[0].date) / 60000) >= minSmsIntervalMinutesIfTempNotIncrease);
                    oids.mailsend = oids.mailsend || (((docs[0].epm_temperature || 0) < oids.epm_temperature) && (Math.round((Date.now() - docs[0].date) / 60000) >= minSmsIntervalMinutes));

                    if (oids.mailsend) Mail.send(oids.epm_temperature, oids.epm_humidity);
                    db.insert(oids);
                }
            });
        } else
            db.insert(oids);
    })
}

module.exports.Job = new CronJob({
    cronTime: require('./settings.json').cronTime || '00 * * * * *',
    onTick: OnTick,
    start: true,
    timeZone: 'Europe/Samara'
});