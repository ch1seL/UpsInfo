var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true });

module.exports.insert = function (doc) {
    db.insert(doc);
}

module.exports.getlast = function (limit) {
    // $where: function () { return new Date(this.date).getMinutes().toString()[1]=="0"}; 
    return db.find({} ).sort({ date: -1 }).limit(limit);
}