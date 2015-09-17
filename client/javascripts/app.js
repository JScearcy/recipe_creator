// requirejs.config({
//   baseUrl: 'vendors/angularjs',
//});

//requirejs(['angular', 'angular-route', 'angular-animate', 'angular-aria', 'angular-material']);

//function(angular, ngRoute, ngAnimate, ngAria, ngMaterial){
  var app = angular.module('recipeCreator', ['ngMaterial', 'ngRoute']);
  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
      templateUrl: '/views/recipes.html',
      controller: 'recipeMake'
    }).when('/dbsg_calc', {
      templateUrl: '/views/dbsgcalc.html',
      controller: 'dbsgCalc'
    })
  }]);
  app.service('PpgCalc', function (){
    this.calcPpg = function(dbfg) {
      return (1000 * (1 + (dbfg / 100) * 0.04621)) / 1000
    }
  });
  app.controller('recipeMake', ['$scope', '$http', function($scope, $http){
    getGrains();
    getHops();
    getYeasts();
    $scope.addGrains = function(){
      if(!$scope.addedGrains) {
        $scope.addedGrains = {
          Grains: [],
          totalWeight: function() {
            var total = 0;
            $scope.addedGrains.Grains.forEach(function(grain, index) {
              if(grain.grainWt > 0){
                total += parseInt(grain.grainWt);
              }
            });
            return total;
          }
        };
      }
      $scope.addedGrains.Grains.push($scope.grain);
      $scope.grain = {};
    }
    $scope.addHops = function(){
      if(!$scope.addedHops){
        $scope.addedHops = [];
      }
      $scope.addedHops.push($scope.hop);
      $scope.hop = {};
    }
    $scope.deleteItem = function(index, type) {
      if(type == 'grain'){
        $scope.addedGrains.Grains.splice(index, 1);
      } else if(type == 'hop'){
        $scope.addedHops.splice(index,1);
      }
    }
    function getGrains() {
      $http({
        method: 'GET',
        url: '/grains'
      }).then(function(res){
        $scope.grains = res.data;
      });
    }
    function getHops() {
      $http({
        method: 'GET',
        url: '/hops'
      }).then(function(res){
        $scope.hops = res.data;
      });
    }
    function getYeasts() {
      $http({
        method: 'GET',
        url: '/yeast'
      }).then(function(res){
        $scope.yeasts = res.data;
      });
    }
  }]);
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
//};
