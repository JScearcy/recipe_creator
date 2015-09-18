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
    getItem('grains');
    getItem('hops');
    getItem('yeast');

    $scope.recipe = {
      name: 'Enter Name',
      grains: {
        totalWeight: function() {
          var total = 0;
          $scope.recipe.grains.added.forEach(function(grain, index) {
            if(grain.grainWt > 0){
              total += parseInt(grain.grainWt);
            }
          })
          return total;
        },
        totalPPG: function(){
          var total = 0;
          $scope.recipe.grains.added.forEach(function(grain, index){
            total += (Math.round((grain.PPG - 1) * 1000 * grain.grainWt / $scope.recipe.volume)) / 1000;
          })
          return total;
        },
        efficiencyPPG: function(){
          return Math.round($scope.recipe.grains.totalPPG() * ($scope.recipe.efficiency / 100) * 1000) / 1000 + 1;
        },
        added: []
      },
      efficiency: 65,
      attenuation: 70,
      volume: 5,
      hops: {
        added: [],
        ibu: function() {
          if($scope.recipe.hops.added.length > 0) {
            var ibu = 0;
            var util = 26.8;
            $scope.recipe.hops.added.forEach(function(hop) {
              ibu += hop.hopWt * hop.Alpha_Acid * util / ($scope.recipe.volume * 1.34);
            });
            return Math.round(ibu * 100) / 100;
          }
          return 0;
        }
      },
      og: function() {
        if($scope.recipe.grains.added.length > 0) {
          return $scope.recipe.grains.efficiencyPPG();
        } else {
          return 0;
        }
      },
      fg: function() {
        if($scope.recipe.grains.added.length > 0) {
          var yeastFood = Math.round((($scope.recipe.grains.efficiencyPPG() - 1) * 1000) * ($scope.recipe.attenuation / 100)) / 1000;
          return $scope.recipe.og() - yeastFood;
        } else {
        return 0
        }
      },
      abv: function() {
        if($scope.recipe.grains.added.length > 0) {
          var og = $scope.recipe.og(),
              fg = $scope.recipe.fg();
          return Math.round((76.08 * (og-fg) / (1.775 - og)) * (fg / 0.794) * 100) / 100;
        } else {
          return 0
        }
      },
      srm: function() {
        if($scope.recipe.grains.added.length > 0) {
          var totalColor = 0;
          var mcu = $scope.recipe.grains.added.forEach(function(grain, index) {
            totalColor += (grain.lovi * grain.grainWt);
          });
          mcu = totalColor / $scope.recipe.volume;
          return Math.round((1.4922 * (Math.pow(mcu, 0.6859))) * 100) / 100;
        } else {
          return 0;
        }
      },
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
    $scope.addIngredient = function(ingredient, type){
      $scope.recipe[ingredient].added.push($scope[type]);
      $scope.grain = {};
    }
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
