var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true });

var ch = 24 * 60 * 60;

db.find({ date: { $ne: { undefined } } })
    .sort({ date: -1 })
    //.projection((item) => { return { date2: Math.round(item.date / ch) * ch, epm_temperature: item.epm_temperature, epm_humidity: item.epm_humidity }; })
    .exec((err, docs) => {
        if (err != null) {
            console.log(err);
            return;
        }

        var result = docs
            .map((item) => { return { date: Math.round(item.date / ch) * ch, epm_temperature: item.epm_temperature, epm_humidity: item.epm_humidity } })
            .reduce(function (acc, cur) {
                altIndex = acc.length - 1;
                if ((acc[altIndex] || { date: 0 }).date == cur.date) {
                    acc[altIndex].temp = (acc[altIndex].epm_temperature + cur.epm_temperature) / 2;
                    acc[altIndex].hum = (acc[altIndex].epm_humidity + cur.epm_humidity) / 2;
                }
                else {
                    acc.push({ date: cur.date, epm_temperature: cur.epm_temperature, epm_humidity: cur.epm_humidity });
                }

                return acc;
            }, []);
    });


