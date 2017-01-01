var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true });

module.exports.insert = function (doc) {    
    db.insert(doc);
}

module.exports.getlast = function (limit) {    
    return db.find({ $where: function () { return new Date(this.date).getMinutes() % 5 == 0 } }).sort({ date: -1 }).limit(limit);
}

module.exports.lastMailSend = function () {
    return db.find({ mailsend: true }).sort({ date: -1 }).limit(1);
}