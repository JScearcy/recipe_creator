var express = require('express');
var router = express.Router();
var sqlite = require('sqlite3');
var path = require('path');

var dbLocation = path.join(__dirname, '../models/Fermentables.db')
var db = new sqlite.Database(dbLocation);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var yeasties = [];
  db.each('SELECT * from Yeast', function(err, yeast){
    if (err) {
      console.log(err);
    }
    yeasties.push(yeast);
  }, function(){
    res.json(yeasties);
  })
});

module.exports = router;
