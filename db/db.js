var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true });

module.exports.insert = function (doc) {
    db.insert(doc);
}

module.exports.getlast = function (dateStart, dateEnd) {
    return db.find({
        date: { $gte: dateStart, $lte: dateEnd }
    })
        .sort({ date: 1 })
}

module.exports.lastMailSend = function () {
    return db.find({ mailsend: true }).sort({ date: -1 }).limit(1);
}