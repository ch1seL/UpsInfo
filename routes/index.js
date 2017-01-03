var express = require('express');
var router = express.Router();
var settings = require('../settings.json')

/* GET home page. */
router.get('/', function (req, res, next) {
  var hours = req.params.hours || settings["historyHours"] || 24;
  res.render('index');
});

module.exports = router;
