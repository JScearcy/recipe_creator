var express = require('express');
var router = express.Router();
var path = require('path');
var Recipe = require('../../models/recipe');

//respond with something on post request while authenticated
router.post('/', function(req, res, next){
  console.log(req.body);
  Recipe.Create(req.body, function(err, recipe){
    if (err) console.log(err);
    res.json(recipe);
  })
});

module.exports = router;
