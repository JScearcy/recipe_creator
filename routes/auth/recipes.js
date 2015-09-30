var express = require('express');
var router = express.Router();
var path = require('path');
var Recipe = require('../../models/recipe');
var recipeValidator = require('../../custom_modules/recipe-validation');
var sendErrors = require('../../custom_modules/send-errors');
var customValidator = require('../../custom_modules/custom-validators');

//will create recipe in the db when run - validate the recipe first!

router.post('/', function(req, res, next){
  var errors = recipeValidator(req);
  sendErrors(errors, function(){
    Recipe.Create(req.body, function(err, oldrecipe, newrecipe){
      if (err) console.log(err);
      if (newrecipe) {
        Recipe.Update(oldrecipe, newrecipe, function(oldrecipe, newrecipe){
          res.status(200).send('Update Complete');
        })
      } else {
        res.status(200).send('Update Complete');
      }
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
router.delete('/delete', function(req, res, next){
  req.checkBody('id', 'Invalid ID').isObjectId();
  var errors = req.validationErrors();
  sendErrors(errors, function(){
    Recipe.Delete(req.body.id, function(){
      res.sendStatus(200);
    });
  });
});

module.exports = router;
