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
    });
  }]);
  app.service('PpgCalc', function (){
    this.calcPpg = function(dbfg) {
      return (1000 * (1 + (dbfg / 100) * 0.04621)) / 1000
    }
  });
  //controller for the recipe builder
  app.controller('recipeMake', ['$scope', '$http', 'jwtHelper', function($scope, $http, jwtHelper){
    $scope.user = {};
    $scope.user.recipetemplate = '/views/notloggedin.html';
    //get all items listed in the select menu
    getItem('grains');
    getItem('hops');
    getItem('yeasts');
    //The object used for recipe creation as well as calculations
    $scope.recipe = {
      name: '',
      grains: {
        //this calculates the weight of all grains added
        totalWeight: function() {
          var total = 0;
          $scope.recipe.grains.added.forEach(function(grain, index) {
            if(grain.grainWt > 0){
              total += parseInt(grain.grainWt);
            }
          })
          return total;
        },
        //this calculates the max sugar extraction possible from the grains
        totalPPG: function(){
          var total = 0;
          $scope.recipe.grains.added.forEach(function(grain, index){
            total += (Math.round((grain.PPG - 1) * 1000 * grain.grainWt / $scope.recipe.volume)) / 1000;
          })
          return total;
        },
        //this calculates the estimated sugar extraction based on user's eff. input
        efficiencyPPG: function(){
          var effPPG = Math.round($scope.recipe.grains.totalPPG() * ($scope.recipe.efficiency / 100) * 1000) / 1000 + 1;
          if(effPPG > 1.5) {
            effPPG = 1.5;
          }
          if(effPPG.toString().length > 5) {
            effPPG = effPPG.toString().slice(0, 5);
          };
          return effPPG;
        },
        //list of all grains added
        added: []
      },
      //default inputs for efficiency, attenuation, and volume
      efficiency: 65,
      attenuation: 70,
      volume: 5,
      hops: {
        //list of all hops added
        added: [],
        //calculates ibu's for user's input hops
        ibu: function() {
          if($scope.recipe.hops.added.length > 0 && $scope.recipe.grains.added.length > 0) {
            var ibu = 0;
            var aau = 0;
            var bigFact = 1.65 * Math.pow(0.000125, ($scope.recipe.og() - 1));
            $scope.recipe.hops.added.forEach(function(hop) {
              aau = hop.hopWt * (hop.Alpha_Acid / 100) * 7490 / $scope.recipe.volume;
              if(hop.hopType == 'boil') {
                var boilTFact = ((1 - Math.pow(2.71828182845904523536, (-.04 * hop.hopTime))) / 3.8);
                var util = bigFact * boilTFact;
                ibu += util * aau;
              } else if(hop.hopType == 'whirlpool') {
                var util = 10;
                ibu += util * aau
              }
            });
            return Math.round(ibu * 100) / 100;
          }
          return 0;
        }
      },
      //this is the function to store the OG on the page
      og: function() {
        if($scope.recipe.grains.added.length > 0) {
          return $scope.recipe.grains.efficiencyPPG();
        } else {
          return 0;
        }
      },
      //this calculates the final gravity based on attenuation
      fg: function() {
        if($scope.recipe.grains.added.length > 0) {
          var yeastFood = Math.round((($scope.recipe.grains.efficiencyPPG() - 1) * 1000) * ($scope.recipe.attenuation / 100)) / 1000;
          yeastFood = $scope.recipe.og() - yeastFood;
          if(yeastFood.toString().length > 5) {
            yeastFood = yeastFood.toString().slice(0, 5);
          }
          return yeastFood;
        } else {
        return 0
        }
      },
      //abv calc based on estimated OG and FG
      abv: function() {
        if($scope.recipe.grains.added.length > 0) {
          var og = $scope.recipe.og(),
              fg = $scope.recipe.fg();
          return Math.round((76.08 * (og-fg) / (1.775 - og)) * (fg / 0.794) * 100) / 100;
        } else {
          return 0
        }
      },
      //estimate color based on grains added
      srm: function() {
        if($scope.recipe.grains.added.length > 0) {
          var totalColor = 0;
          var mcu = $scope.recipe.grains.added.forEach(function(grain, index) {
            totalColor += (grain.lovi * grain.grainWt);
          });
          mcu = totalColor / $scope.recipe.volume;
          mcu = Math.round((1.4922 * (Math.pow(mcu, 0.6859))) * 100) / 100;
          if(mcu > 50){
            mcu = 50;
          };
          return mcu;
        } else {
          return 0;
        }
      },
      //estimate enzymatic activity based on grains added
      dp: function() {
        if($scope.recipe.grains.added.length > 0) {
          var totaldp = 0;
          $scope.recipe.grains.added.forEach(function(grain, index) {
            totaldp += grain.dp * grain.grainWt;
          });
          return Math.round(totaldp / $scope.recipe.grains.totalWeight());
        } else {
          return 0;
        }
      },
      notes: ''
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
    //generic function to add an item to the array for those ingredients
    $scope.addIngredient = function(ingredient, type){
      $scope.recipe[ingredient].added.push($scope[type]);
      $scope.grain = {};
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
        };
        $scope.user = {};
        $location.url('/');
      })
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
        if(!$scope.user.err) {
          $location.url('/login');
        }
      })
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
