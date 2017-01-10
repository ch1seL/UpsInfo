var express = require('express');
var router = express.Router();
var settings = require('../settings.json')

/* GET home page. */

router.get('/:hours(|[0-9]+)', function(req, res, next) {
    req.params.hours = req.params.hours == "" ? 24 : req.params.hours;
    req.params.start = req.params.start || Date.now() - req.params.hours * 60 * 60 * 1000;
    req.params.end = req.params.end || Date.now();

    delete req.params.hours;

    req.params.timezoneOffset = settings.timezoneOffset || 4;

    console.log(req.params);
    res.render('index', req.params);
});

router.get('/:start([0-9]+)-:end([0-9]+)', function(req, res, next) {
    req.params.timezoneOffset = settings.timezoneOffset || 4;
    res.render('index', req.params);
});

module.exports = router;