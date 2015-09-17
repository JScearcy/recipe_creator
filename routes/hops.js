var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3');
var path = require('path');

var dbLocation = path.join(__dirname, '../models/Fermentables.db')
var db = new sqlite.Database(dbLocation);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var hops = [];
  db.each('SELECT * from Hops', function(err, hop){
    if (err) {
      console.log(err);
    }
    hops.push(hop);
  }, function(){
    res.json(hops);
  })
});

module.exports = router;
