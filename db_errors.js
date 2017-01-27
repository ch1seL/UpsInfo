var Datastore = require('nedb');
var db = new Datastore({ filename: 'db/upshistory.db', autoload: true });
var db2 = new Datastore({ filename: 'db/upshistory_shrink.db', autoload: true });

db.find({ error: { $exists: true } }).sort({ date: -1 }).exec((err, docs) => {
    docs.forEach((item) => {
        console.log(item.error);
    })

});

db.remove({ epm_temperature: null }, { multi: true }, function(err, numRemoved) {
    console.log(err || `Удалено epm_temperature=null ${numRemoved}`);
});

db.remove({ epm_humidity: null }, { multi: true }, function(err, numRemoved) {
    console.log(err || `Удалено epm_humidity=null ${numRemoved}`);
});