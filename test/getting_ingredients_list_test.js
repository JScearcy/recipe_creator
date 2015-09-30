describe('getting each item from the database', function(){
  var scope,
      ctrl,
      recipeFunc;

  beforeEach(module('recipeCreator'));

  beforeEach(inject(function($rootScope, $controller, _recipeFunc_){
    scope = $rootScope.$new();
    ctrl = $controller('recipeMake', {$scope: scope});
    recipeFunc = _recipeFunc_;
  }));
  it('should return a grains, hops, and yeasts array of objects', inject(function($http, $httpBackend){
    $httpBackend
      .expect('GET', '/grains')
      .respond(200, [{
        name: '2-Row (Brewer\'s Malt)',
        id: 1,
        lovi: 1.8,
        dp:140,
        PPG: 1.037
      }]);
    $httpBackend
      .expect('GET', '/hops')
      .respond(200, [{
        Name: 'Citra',
        id: 1,
        Alpha_Acid: 12
      }])
    $httpBackend
      .expect('GET', '/yeasts')
      .respond(200, [{
        ID: 2112,
        Name: 'California Lager',
        charandApps: 'Tasty steam beers'
      }])
    $httpBackend.flush();

    expect(scope.grains[0].name).to.equal('2-Row (Brewer\'s Malt)');
    expect(scope.hops[0].Name).to.equal('Citra');
    expect(scope.yeasts[0].Name).to.equal('California Lager');
  }));
});
