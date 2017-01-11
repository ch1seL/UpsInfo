var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/:hours(|[0-9]+)', function(req, res, next) {
    var settings = require('../settings.json');

    req.params.hours = req.params.hours == "" ? settings.defaultHours || 24 : req.params.hours;
    req.params.start = req.params.start || Date.now() - req.params.hours * 60 * 60 * 1000;
    req.params.end = req.params.end || Date.now();
    delete req.params.hours;
    req.params.settings = settings;

    res.render('index', req.params);
});

router.get('/:start([0-9]+)-:end([0-9]+)', function(req, res, next) {
    req.params.settings = require('../settings.json');
    res.render('index', req.params);
});

module.exports = router;