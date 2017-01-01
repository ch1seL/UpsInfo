var express = require('express');
var router = express.Router();
var db=require('../db/db'); 

/* GET gethistory. */
router.get('/', function (req, res, next) {
  db.getlast(100).exec(function (err, docs) {    
    console.log(docs.length);
    res.json(docs);
  });
});

module.exports = router;
