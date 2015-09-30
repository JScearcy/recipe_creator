describe('loading a recipe from the server', function(){
  var scope,
      ctrl,
      recipeFunc;

  beforeEach(module('recipeCreator'));

  beforeEach(inject(function($rootScope, $controller, $httpBackend, _recipeFunc_){
    scope = $rootScope.$new();
    ctrl = $controller('savedRecipes', {$scope: scope});
    recipeFunc = _recipeFunc_;
    scope.recipes = [];
    savedRecipeHandler = $httpBackend
        .expect('POST', '/private/recipes/saved')
        .respond(200, [{
          name: 'testcipe',
          efficiency: 65,
          attenuation: 75,
          volume: 5,
          grains: {
            added: [{
              name: '2-Row (Brewer\'s Malt)',
              id: 1,
              lovi: 1.8,
              dp:140,
              PPG: 1.037,
              weight: 10
            }]
          },
          hops: {
            added: [{
              Name: 'Citra',
              id: 1,
              Alpha_Acid: 12,
              hopTime: 60,
              weight: 1,
              hopType: 'Boil'
            }]
          },
          notes: '',
          yeast: {}
        }]);
  }));

  it('should pull a recipe from the "server" and return the proper values', inject(function($http, $httpBackend){
    scope.getSavedRecipes();
    $httpBackend.flush();
    //test the values in the calculateStats function to verify correctness
    expect(scope.recipes).to.be.ok;
    expect(scope.recipes[0].grains).to.be.ok;
    expect(scope.recipes[0].hops.added.length).to.be.above(0);
    expect(scope.recipes[0].og).to.equal(1.048);
    expect(scope.recipes[0].fg).to.equal(1.012);
    expect(scope.recipes[0].dp).to.equal(140);
    expect(scope.recipes[0].abv).to.equal(4.8);
    expect(scope.recipes[0].srm).to.equal(3.59);
  }));
  it('should send a delete request to the server with an id in the body and call the callback which pulls recipes on completion', inject(function($http, $httpBackend){
    scope.recipes = [];
    scope.deleteRecipe({_id: 1});
    $httpBackend
    .when('DELETE', '/private/recipes/delete/')
    .respond(200, {msg: 'deleted'});
    $httpBackend.flush();
    expect(scope.recipes.length).to.equal(1);
    expect(scope.recipes[0].name).to.equal('testcipe');
  }));
});
