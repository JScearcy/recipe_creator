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
