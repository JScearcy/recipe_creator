describe('the header functions', function(){
  var scope;
  var control;
  beforeEach(module('recipeCreator'));

  beforeEach(inject(function($rootScope, $controller){
    scope = $rootScope.$new();
    ctrl = $controller('headerControl', {$scope: scope});
    var sessionStorage = {
      items: {},
      getItem: function(key){
        return items[key];
      },
      setItem: function(key, value) {
        items[key] = value;
      },
      clear: function(){
        sessionStorage.items = {};
      }
    };
  }));
  it('should check sessionStorage and first return a user and the proper vars and then return defaults', function(){
    var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NDM2MjcxNzAsImV4cCI6MTQ3NTE2MzE3MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidGVzdFVzZXIifQ.Zj_l6H6PiADIhhVK7LlWmRIFlKeI2c7NplRclE2d26o'
    expect(scope.user).to.be.ok;
    sessionStorage.setItem('userToken', jwt);
    scope.$digest();
    expect(scope.user.username).to.equal('testUser');
    expect(scope.user.login).to.equal('Logout testUser');
    sessionStorage.clear();
    scope.$digest();
    expect(scope.user.login).to.equal('Login/Register');
  });
  it('should return the url being visited', function(){
    expect(scope.goToPage('/testpage')).to.equal('/testpage');
  });
});
