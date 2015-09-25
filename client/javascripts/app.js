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
  app.service('PpgCalc', function (){
    this.calcPpg = function(dbfg) {
      return (1000 * (1 + (dbfg / 100) * 0.04621)) / 1000
    }
  });
  //controller for the recipe builder
  app.controller('recipeMake', ['$scope', '$http', 'jwtHelper', 'recipeFunc', function($scope, $http, jwtHelper, recipeFunc){
    $scope.user = {};
    $scope.user.recipetemplate = '/views/notloggedin.html';
    //get all items listed in the select menu
    getItem('grains');
    getItem('hops');
    getItem('yeasts');
    //The object used for recipe creation as well as calculations
    $scope.recipe = {
      efficiency: 65,
      attenuation: 70,
      volume: 5,
      grains: {
        added: []
      },
      hops: {
        added: [],
        ibu: function(){
          return recipeFunc.ibu($scope.recipe.hops.added, $scope.recipe.grains.added, $scope.recipe.volume, $scope.recipe.og());
        }
      },
      og: function(){
        return recipeFunc.efficiencyPPG(recipeFunc.totalPPG($scope.recipe.grains.added, $scope.recipe.volume), $scope.recipe.efficiency)
      },
      fg: function(){
        return recipeFunc.fg($scope.recipe.grains.added, $scope.recipe.og(), $scope.recipe.attenuation)
      },
      abv: function() {
          return recipeFunc.abv($scope.recipe.grains.added, $scope.recipe.og(), $scope.recipe.fg());
        },
      srm: function() {
          return recipeFunc.srm($scope.recipe.grains.added, $scope.recipe.volume);
        },
      dp: function() {
          return recipeFunc.dp($scope.recipe.grains.added, recipeFunc.totalWeight($scope.recipe.grains.added));
        },
      notes: '',
      recipeyeast: $scope.yeast
    };

    $scope.saveRecipe = function(){
      var recipe = {
        username: $scope.user.username,
        name: $scope.recipe.name,
        grains: {
          added: $scope.recipe.grains.added
        },
        efficiency: $scope.recipe.efficiency,
        volume: $scope.recipe.volume,
        attenuation: $scope.recipe.attenuation,
        hops: {
          added: $scope.recipe.hops.added
        },
        notes: $scope.notes
      };
      $http({
        method: 'post',
        url: '/private/recipes',
        data: recipe
      }).then(function(res){
        console.log(res.data);
      })
    }
    $scope.getSavedRecipes = function() {
      $http({
        method: 'post',
        url: '/private/recipes/saved'
      }).then(function(res){
        console.log(res.data);
      })
    };
    //generic function to add an item to the array for those ingredients
    $scope.addIngredient = function(ingredient, type){
      $scope.recipe[ingredient].added.push($scope[type]);
      $scope[type] = {};
    }
    //remove button function - removes one item from the array
    $scope.deleteItem = function(index, type) {
      $scope.recipe[type].added.splice(index, 1);
    }
    //generic function to call the server for a specific ingredient
    function getItem(item){
      $http({
        method: 'GET',
        url: '/' + item
      }).then(function(res) {
        $scope[item] = res.data;
      })
    };
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


  //extra for a calculator controller
  app.controller('dbsgCalc', ['$scope', function($scope){
    console.log('clicked');
    console.log($scope.dbfg + $scope.name);
    // $scope.addgrain = function(){
    //   if(!$scope.grains) {
    //     $scope.grains = [];
    //   }
    //   $scope.grains.push($scope.grain);
    //   $scope.grain = {};
    // }
  }]);


  //controller for login screen - sends user/pass and stores jwt
  app.controller('loginControl', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location){
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
  app.controller('headerControl', ['$rootScope', '$scope', 'jwtHelper', function($rootScope, $scope, jwtHelper){
    $scope.user = {};

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
    }
  }]);
