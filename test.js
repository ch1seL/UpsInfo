var Datastore = require('nedb'),
    db = new Datastore({ filename: 'db/upshistory.db', autoload: true });

db.update({}, { $set: { dateInMs: new Date("date").getTime() } }, { multi: true })