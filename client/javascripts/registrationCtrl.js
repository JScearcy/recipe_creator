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
