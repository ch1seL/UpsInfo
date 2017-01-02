var express = require('express');
var router = express.Router();

/* GET upsinfo. */
router.get('/', function (req, res, next) {
  require('../upsinfo').get(function (oids) {
    res.json(oids);
  });
});

module.exports = router;
