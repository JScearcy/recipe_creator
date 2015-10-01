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
