var express = require('express');
var upsinfo = require('../upsinfo');
var router = express.Router();


/* GET upsinfo. */
router.get('/', function (req, res, next) {
  upsinfo.get(function (oids) {
    res.json(oids);
  });
});

module.exports = router;
