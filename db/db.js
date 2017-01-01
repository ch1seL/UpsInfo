var Datastore = require('nedb'), db = new Datastore({ filename: 'db/upshistory', autoload: true });

module.exports.insert = function (doc) {
    doc.date = Date();
    db.insert(doc);
}

module.exports.getlast = function (limit) {
    return db.find({}).sort({ date: 2 }).limit(limit);
}