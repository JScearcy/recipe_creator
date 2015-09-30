  var app = angular.module('recipeCreator', ['ngMaterial', 'ngRoute', 'angular-jwt']);
  app.config(['$routeProvider',
              '$locationProvider',
              '$mdThemingProvider',
              '$httpProvider',
              'jwtInterceptorProvider',
              function($routeProvider, $locationProvider, $mdThemingProvider, $httpProvider, jwtInterceptorProvider){
    $locationProvider.html5Mode(true);

    jwtInterceptorProvider.tokenGetter = function(){
      return sessionStorage.getItem('userToken');
    }
    $httpProvider.interceptors.push('jwtInterceptor');

    $mdThemingProvider.theme('default')
      .primaryPalette('amber')
      .accentPalette('yellow');

    $routeProvider.when('/', {
      templateUrl: '/views/recipes.html',
      controller: 'recipeMake'
    }).when('/dbsg_calc', {
      templateUrl: '/views/dbsgcalc.html',
      controller: 'dbsgCalc'
    }).when('/login', {
      templateUrl: '/views/login.html',
      controller: 'loginControl'
    }).when('/register', {
      templateUrl:'/views/register.html',
      controller: 'registerControl'
    }).otherwise('/', {
      templateUrl: '/views/recipes.html',
      controller: 'recipeMake'
    });
  }]);
  app.directive('isMatch', function(){
    return {
      require: 'ngModel',
      scope: {
        otherVal: "=isMatch"
      },
      link: function(scope, elem, attr, ngModel) {
        ngModel.$validators.isMatch = function(modelVal) {
          return modelVal === scope.otherVal;
        };
        scope.$watch('otherVal', function(){
          ngModel.$validate();
        });
      }
    };
  });
  //controller for the recipe builder
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
  //controller for login screen - sends user/pass and stores jwt
  app.controller('loginControl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.userLogin = function() {
      $http({
        method: 'post',
        data: $scope.user,
        url: '/loginauth'
      }).then(function(res){
        if(res.data.token){
          sessionStorage.setItem('userToken', res.data.token);
          $scope.user = {};
          $location.url('/');
        };
      }, function(res){
        $scope.error = res.data;
        $scope.user.password = '';
      });
    }
  }]);


  //controller for register page - sends new user info and returns that data
  app.controller('registerControl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.registerUser = function(){
      $http({
        method: 'post',
        data: $scope.user,
        url: '/register'
      }).then(function(res){
        $scope.user = res.data;
        $location.url('/login');
      }, function(res){
        $scope.user = res.data;
      });
    }
  }]);
  app.controller('headerControl', ['$scope', 'jwtHelper', function($scope, jwtHelper){
    $scope.user = {};
    $scope.goToPage = function(url) {
      return url;
    }
    $scope.$watch(function(){
      return sessionStorage.getItem('userToken');
    }, function(){
      if(sessionStorage.getItem('userToken')){
        $scope.user = jwtHelper.decodeToken(sessionStorage.getItem('userToken'));
        $scope.user.login = 'Logout ' + $scope.user.username;
        $scope.user.loginUrl = '/';
      } else {
        $scope.user = {};
        $scope.user.login = 'Login/Register';
        $scope.user.loginUrl = '/login'
      }
    });

    $scope.logOut = function() {
      sessionStorage.removeItem('userToken');
    };
  }]);

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
      console.log('button clicked')
      $scope.ppgItems = [];
    };
    $scope.addGrain = function() {
      $scope.ppgItems.push(new PpgCalc.newItem($scope.newItem, PpgCalc));
      $scope.newItem = {};
    };
  }]);
