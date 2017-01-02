var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true }),
    db_old = new Datastore({ filename: 'db/upshistory_old.db', autoload: true });

db_old.find({ date: { $ne: undefined } }).exec((err, docs) => {

    var qwe = docs.map((item) => {

        date = new Date(item.date);
        newItem = { date: date.getTime(), epm_temperature: item.epm_temperature, epm_humidity: item.epm_humidity };
        if (item.mailsend != undefined)
            newItem.mailsend = item.mailsend;

        return newItem;
    });

    console.log(qwe);
     db.insert(qwe);
})