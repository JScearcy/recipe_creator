app.controller('recipeMake', ['$scope', '$http', 'jwtHelper', 'recipeFunc', function($scope, $http, jwtHelper, recipeFunc){
  $scope.user = {};
  $scope.user.recipetemplate = '/views/notloggedin.html';

  //get all items listed in the select menu
  recipeFunc.getItem($http, $scope, 'grains');
  recipeFunc.getItem($http, $scope, 'hops');
  recipeFunc.getItem($http, $scope, 'yeasts');

  //The object used for recipe creation as well as calculations
  $scope.recipe = new recipeFunc.recipe($scope, recipeFunc);

  //Save/clear/edit function for button ng-click
  $scope.clearCurrentRecipe = function(){ return new recipeFunc.clearCurrentRecipe($scope, recipeFunc) };
  $scope.saveRecipe = function(){ return recipeFunc.saveRecipe($http, $scope, recipeFunc) };
  $scope.editRecipe = function(recipe) { return recipeFunc.editRecipe(recipe, $scope, recipeFunc) }

  //generic function to add an item to the array for those ingredients
  $scope.addIngredient = function(ingredient, type, model){
    switch(type) {
      case 'grains':
        var addedIngredient = new recipeFunc.newGrain(ingredient);
        break;
      case 'hops':
        var addedIngredient = new recipeFunc.newHop(ingredient);
        break;
      default:
        return;
    };
    $scope.recipe[type].added.push(addedIngredient);
    $scope[model] = {};
  }
  //remove button function - removes one item from the array
  $scope.deleteItem = function(index, type) {
    $scope.recipe[type].added.splice(index, 1);
  }

  $scope.$watch(function(){
    return sessionStorage.getItem('userToken');
  }, function(){
      if(sessionStorage.getItem('userToken')) {
        var userToken = jwtHelper.decodeToken(sessionStorage.getItem('userToken'));
        $scope.user = userToken;
        $scope.user.recipetemplate = '/private/views/savedrecipes.html'
    } else {
      $scope.user = {};
      $scope.user.recipetemplate = '/views/notloggedin.html'
    }
  });

}]);
