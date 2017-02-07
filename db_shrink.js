function Reduce(inarr) {
    count = 0;
    return inarr.sort({ date: -1 }).reduce(function(acc, cur, index) {

        if (acc.length == 0) {
            acc.push({ date: cur.date, epm_temperature: cur.epm_temperature, epm_humidity: cur.epm_humidity });
            count = 1;
            return acc;
        }

        accIndex = acc.length - 1;

        if (acc[accIndex].date == cur.date) {
            acc[accIndex].epm_temperature += cur.epm_temperature;
            acc[accIndex].epm_humidity += cur.epm_humidity;
            count++;
        } else {
            acc[accIndex].epm_temperature /= count;
            acc[accIndex].epm_humidity /= count;

            acc.push({ date: cur.date, epm_temperature: cur.epm_temperature, epm_humidity: cur.epm_humidity });
            count = 1;
        }

        if (index == inarr.length - 1) {
            acc[accIndex].epm_temperature /= count;
            acc[accIndex].epm_humidity /= count;
        }

        return acc;
    }, []);
}

var Datastore = require('nedb');
var db = new Datastore({ filename: 'db/upshistory.db', autoload: true });
var db2 = new Datastore({ filename: 'db/upshistory_shrink.db', autoload: true });

db.find().sort({ date: -1 }).exec((err, docs) => {
    var newdocs = docs.map((item) => {
        var ch = 60 * 1000;
        item.date = item.date - item.date % ch;
        return item;
    })
    console.log(newdocs.length);
    newdocs = Reduce(newdocs);
    console.log(newdocs.length);
    newdocs.forEach((item) => {
        db2.insert(item);
    })
});

