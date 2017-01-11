var CronJob = require('cron').CronJob;
var Mail = require('./mail');
var UpsInfo = require('./upsinfo');
var db = require('./db')
var settings = require('./settings.json')

const alertTemp = settings["alertTemp"] || 22;
const alertHumMin = settings["alertHumMin"] || 20;
const alertHumMax = settings["alertHumMax"] || 50;
const minSmsIntervalMinutes = settings["minSmsIntervalMinutes"] || 10;

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
var OnTick = function OnTick() {
    purgeCache('./settings.json');    
    UpsInfo.get(function(oids) {
        if (oids.error === undefined && ((oids.epm_temperature >= alertTemp) || (oids.epm_humidity >= alertHumMax) || (oids.epm_humidity <= alertHumMin))) {
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