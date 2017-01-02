var express = require('express');
var router = express.Router();
var db = require('../db/db');

var hours = 30;

/* GET gethistory. */
router.get('/', function (req, res, next) {
  db.getlast(hours).exec(function (err, docs) {

    //console.log(docs);
    ch = hours * 60 * 60 * 100;
    var result = docs
      .map((item) => {
        //console.log(Math.round(item.date / ch) * ch);
        return { date: Math.round(item.date / ch) * ch, epm_temperature: item.epm_temperature, epm_humidity: item.epm_humidity }
      })
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

    //console.log(result);
    res.json(result);
  });
});

module.exports = router;
