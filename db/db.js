var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true });

module.exports.insert = function (doc) {
    db.insert(doc);
}

module.exports.getlast = function (hours) {

    //миллисекунд в часах
    ch = hours * 60 * 60 * 1000;
    dateStart = new Date();
    dateStart = dateStart.getTime() - ch;
    return db.find({
        date: { $gte: dateStart }
    })
        .sort({ date: 1 })
}

module.exports.lastMailSend = function () {
    return db.find({ mailsend: true }).sort({ date: -1 }).limit(1);
}