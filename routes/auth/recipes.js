var express = require('express');
var router = express.Router();
var path = require('path');
var Recipe = require('../../models/recipe');

//respond with something on post request while authenticated
router.post('/', function(req, res, next){
  Recipe.Create(req.body, function(err, recipe){
    if (err) console.log(err);
    res.json(recipe);
  })
});
router.post('/saved', function(req, res, next){
  Recipe.find({username: req.user.username}, function(err, recipes){
    res.json(recipes);
  });
});

module.exports = router;
