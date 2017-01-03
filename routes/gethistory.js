var express = require('express');
var router = express.Router();
var db = require('../db/db');
var upsinfo = require('../upsinfo');
var settings = require('../settings.json')



/* GET gethistory. */
router.get('/', function (req, res, next) {

  //console.log(req.params);
  var hours = req.params.hours || settings["historyHours"] || 24;
  var ch = hours * 60 * 60 ;

  db.getlast(hours).exec(function (err, docs) {
    var result = docs
      .map((item) => {
        return { date: Math.floor(item.date / ch) * ch, epm_temperature: item.epm_temperature, epm_humidity: item.epm_humidity }
      });

    upsinfo.get((upsinfo) => {
      result.push(upsinfo);

      startIndex = -1;
      result = result.reduce(function (acc, cur, index) {
        altIndex = acc.length - 1;
        if ((acc[altIndex] || { date: 0 }).date == cur.date) {
          acc[altIndex].epm_temperature += cur.epm_temperature;
          acc[altIndex].epm_humidity += cur.epm_humidity;
        }
        else {
          if (acc[altIndex] != undefined) {
            count = index - startIndex;
            acc[altIndex].epm_temperature /= count;
            acc[altIndex].epm_humidity /= count;
          }
          startIndex = index;
          acc.push({ date: cur.date, epm_temperature: cur.epm_temperature, epm_humidity: cur.epm_humidity });
        }

        return acc;
      }, []);
      res.json(result);

    });
  });
});

module.exports = router;
