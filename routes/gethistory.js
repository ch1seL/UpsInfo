var express = require('express');
var router = express.Router();
var db = require('../db');
var upsinfo = require('../upsinfo');

function Reduce(result) {
    count = 0;
    result = result
        .filter((item) => (item.epm_temperature != null) && (item.epm_humidity != null))
        .reduce(function(acc, cur, index) {


            if (acc.length == 0) {
                acc.push({
                    date: cur.date,
                    epm_temperature_max: cur.epm_temperature,
                    epm_temperature_min: cur.epm_temperature,
                    epm_humidity_max: cur.epm_humidity,
                    epm_humidity_min: cur.epm_humidity
                });
                count = 1;
                return acc;
            }

            accIndex = acc.length - 1;

            if (acc[accIndex].date == cur.date) {
                acc[accIndex].epm_temperature_max = Math.max(acc[accIndex].epm_temperature_max, cur.epm_temperature);
                acc[accIndex].epm_temperature_min = Math.min(acc[accIndex].epm_temperature_min, cur.epm_temperature);
                acc[accIndex].epm_humidity_max = Math.max(acc[accIndex].epm_humidity_max, cur.epm_humidity);
                acc[accIndex].epm_humidity_min = Math.min(acc[accIndex].epm_humidity_min, cur.epm_humidity);
            } else {
                acc.push({
                    date: cur.date,
                    epm_temperature_max: cur.epm_temperature,
                    epm_temperature_min: cur.epm_temperature,
                    epm_humidity_max: cur.epm_humidity,
                    epm_humidity_min: cur.epm_humidity
                });
                count = 1;
            }
            return acc;
        }, []);

    return result;
}

function getRes(reqParam, res) {
    var start = parseInt(reqParam.start || (Date.now() - ((reqParam.hours == "" ? 24 : reqParam.hours) * 60 * 60 * 1000)));
    var end = parseInt(reqParam.end || Date.now());

    db.getlast(start, end).exec(function(err, docs) {
        var result = docs
            .map((item) => {
                var ch = (docs[docs.length - 1].date - docs[0].date) / 200;
                return { date: Math.floor(item.date / ch) * ch, epm_temperature: item.epm_temperature, epm_humidity: item.epm_humidity, epm_temperature_max: item.epm_temperature_max }
            });

        //Если по текущую дату, добавим последние показания
        if (Math.round(end / 60000) == Math.round(Date.now() / 60000))
            upsinfo.get((upsinfo) => {
                if (upsinfo !== null) result.push(upsinfo);
                res.json(Reduce(result));
            });
        else
            res.json(Reduce(result));
    });
}

/* GET gethistory. */
router.get('/:hours(|[0-9]+)', function(req, res, next) {
    getRes(req.params, res);
});

/* GET gethistory. */
router.get('/:start([0-9]+)-:end([0-9]+)', function(req, res, next) {
    getRes(req.params, res);
});

module.exports = router;