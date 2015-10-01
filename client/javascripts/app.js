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
