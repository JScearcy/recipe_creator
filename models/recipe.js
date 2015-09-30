var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecipeSchema = new Schema ({
  username: {type: String, required: true},
  name: {type: String, required: true},
  grains: {added: Array},
  efficiency: {type: Number, required: true},
  volume: {type: Number, required: true},
  attenuation: {type: Number, required: true},
  hops: {added: Array},
  yeast: Schema.Types.Mixed,
  notes: String
});

RecipeSchema.statics.Create = function(recipe, callback) {
  this.findOne({name: recipe.name}, function(err, exists){
    if (err) return callback(err);
    if (exists) return callback(null, exists, recipe);
    var Recipe = mongoose.model('Recipe', RecipeSchema);
    var newRecipe = new Recipe({
      username: recipe.username,
      name: recipe.name,
      grains: {
        added: recipe.grains.added
      },
      efficiency: recipe.efficiency,
      volume: recipe.volume,
      attenuation: recipe.attenuation,
      hops: {
        added: recipe.hops.added
      },
      yeast: recipe.yeast,
      notes: recipe.notes
    });
    newRecipe.save(function(err, newRecipe){
      if(err) return callback(err);
      return callback(null, newRecipe);
    })
  })
};
RecipeSchema.statics.Delete = function(id, callback) {
  this.findByIdAndRemove(id, function(){
    callback();
  });
};
RecipeSchema.statics.Update = function(oldrecipe, newrecipe, callback) {
  current = this;
  current.findByIdAndUpdate(oldrecipe._id, newrecipe, function(){
    oldrecipe.name = oldrecipe.name + ' backup';
    current.Create(oldrecipe, function(){
      callback(newrecipe, oldrecipe);
    });
  });
};


module.exports = mongoose.model('Recipes', RecipeSchema)
