describe('registration process', function(){
  var scope;
  var ctrl;

  beforeEach(module('recipeCreator'));
  beforeEach(inject(function($rootScope, $controller, $httpBackend){
    scope = $rootScope.$new();
    ctrl = $controller('registerControl', {$scope: scope});
    registerHandler = $httpBackend
    .when('POST', '/register')
    .respond(200, {username: 'testUser'});
  }));
  it('should post a user and set scope user to have that username', inject(function($httpBackend){
    scope.user = {
      username: 'testUser'
    };
    scope.registerUser();
    scope.user = {};
    $httpBackend.flush();
    expect(scope.user.username).to.equal('testUser');
  }));
  it('should trigger the failure function and have an err', inject(function($httpBackend){
    scope.user = {
      username: 'testUser'
    };
    registerHandler.respond(401, 'Failure...');
    scope.registerUser();
    scope.user = {};
    $httpBackend.flush();
    expect(scope.user.username).to.equal(undefined);
    expect(scope.user).to.equal('Failure...');
  }));
});
