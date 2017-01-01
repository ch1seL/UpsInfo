var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true });

module.exports.insert = function (doc) {
    db.insert(doc);
}

module.exports.getlast = function (limit) {
    return db.find({}).sort({ date: -1 }).limit(limit);
}