var express = require('express');
var router = express.Router();
var db=require('../db/db'); 

/* GET gethistory. */
router.get('/', function (req, res, next) {
  db.getlast(1000).exec(function (err, docs) {    
    res.json(docs);
  });
});

module.exports = router;
