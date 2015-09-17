var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3');
var path = require('path');

var dbLocation = path.join(__dirname, '../models/Fermentables.db')
var db = new sqlite.Database(dbLocation);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var grains = [];
  db.each('SELECT * from Grains', function(err, grain){
    if (err) {
      console.log(err);
    }
    grains.push(grain);
  }, function(){
    res.json(grains);
  })
});

module.exports = router;
