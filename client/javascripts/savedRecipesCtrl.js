app.controller('savedRecipes', ['$scope', '$http','recipeFunc', function($scope, $http, recipeFunc){
  $scope.deleteRecipe = function(recipe) {
    recipeFunc.deleteRecipe(recipe._id, $http, function(res){
      $scope.getSavedRecipes();
    });
  };
  $scope.getSavedRecipes = function() { return recipeFunc.getSavedRecipes($scope, $http, recipeFunc) };
}]);
app.controller('dbsgCalc', ['$scope', 'PpgCalc', function($scope, PpgCalc){
  $scope.ppgItems = [];
  $scope.clearAll = function() {
    $scope.ppgItems = [];
  };
  $scope.addGrain = function() {
    $scope.ppgItems.push(new PpgCalc.newItem($scope.newItem, PpgCalc));
    $scope.newItem = {};
  };
}]);
