var express = require('express');

var router = express.Router();


/* GET gethistory. */
router.get('/', function (req, res, next) {
  require('../db/db').getlast(5).exec(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

module.exports = router;
