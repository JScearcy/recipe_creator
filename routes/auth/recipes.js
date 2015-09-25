var express = require('express');
var router = express.Router();
var path = require('path');
var Recipe = require('../../models/recipe');
var recipeValidator = require('../../custom_modules/recipe-validation');
var sendErrors = require('../../custom_modules/send-errors');

//will create recipe in the db when run - validate the recipe first!

router.post('/', function(req, res, next){
  var errors = recipeValidator(req);
  sendErrors(errors, function(){
    Recipe.Create(req.body, function(err, recipe){
      if (err) console.log(err);
      res.json(recipe);
    });
  });
});
router.post('/saved', function(req, res, next){
  req.checkBody('username', 'Invalid Username').isUsername();
  var errors = req.validationErrors();
  sendErrors(errors, function(){
    Recipe.find({username: req.user.username}, function(err, recipes){
      res.json(recipes);
    });
  });
});

module.exports = router;
