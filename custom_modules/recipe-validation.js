
var recipeValidation = function(req){
  req.checkBody('username', 'Invalid Username').isUsername();
  req.checkBody('name', 'Invalid Recipe Name').isUsername();
  req.checkBody('grains.added', 'Invalid Grains').isIngredient();
  req.checkBody('efficiency', 'Invalid Efficiency').isNumeric();
  req.checkBody('volume', 'Invalid Volume').isNumeric();
  req.checkBody('attenuation', 'Invalid Attenuation').isNumeric();
  req.checkBody('hops.added', 'Invalid Hops').isIngredient();
  console.log('Validating..');
  var errors = req.validationErrors();
  return errors;
}

module.exports = recipeValidation;
