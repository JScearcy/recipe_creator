//TODO finish going through recipeservice.js to test each function.

//main page - the recipe creator
describe('recipe creation', function(){
  //reset the vars
  var scope;
  var ctrl;
  beforeEach(module('recipeCreator'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('recipeMake', {$scope: scope});
  }));

  describe('recipe object', function(){
    it('should have a recipe object on init', function(){
      assert.isDefined(scope.recipe);
    });
    it('should not have any grains on init', function(){
      expect(scope.recipe.grains.added.length).to.equal(0);
    });
    it('should not have any hops on init', function(){
      expect(scope.recipe.hops.added.length).to.equal(0);
    });
    it('should not have a name on init', function(){
      expect(scope.recipe.name).to.equal(undefined);
    });
    it('should add a grain to the recipe object', function(){
      scope.addIngredient({name: '2-Row'}, 'grains', 'grain');
      expect(scope.recipe.grains.added.length).to.be.above(0);
    });
    it('should add a hop to the recipe object', function(){
      scope.addIngredient({name: 'Citra'}, 'hops', 'hop');
      expect(scope.recipe.hops.added.length).to.be.above(0);
    });
  });

  //still the recipe creator
  describe('when a grain and hop are added with the default volume', function(){
    var scope;
    var ctrl;
    var recipeFunc;

    beforeEach(inject(function($rootScope, $controller, _recipeFunc_) {
      scope = $rootScope.$new();
      ctrl = $controller('recipeMake', {$scope: scope});
      recipeFunc = _recipeFunc_;
      scope.addIngredient({
        name: '2-Row (Brewer\'s Malt)',
        id: 1,
        lovi: 1.8,
        dp:140,
        PPG: 1.037,
        weight: 10
      }, 'grains', 'grain');
      scope.addIngredient({
        Name: 'Citra',
        id: 1,
        Alpha_Acid: 12,
        hopTime: 60,
        weight: 1,
        hopType: 'boil'
      }, 'hops', 'hop');
    }));
    it('the recipe should have an abv of 4.8', function(){
      expect(scope.recipe.abv()).to.equal(4.8);
    })
    it('the recipe should have an OG of 1.048', function(){
      expect(scope.recipe.og()).to.equal(1.048);
    });
    it('the recipe should have an SRM of 3.59', function(){
      expect(scope.recipe.srm()).to.equal(3.59);
    });
    it('the recipe should have a FG of 1.012', function(){
      expect(scope.recipe.fg()).to.equal(1.012);
    });
    it('the recipe should have a diastatic power of 140', function(){
      expect(scope.recipe.dp()).to.equal(140);
    });
    it('the recipe should have an IBU\'s number of 16.72', function(){
      expect(scope.recipe.hops.ibu(scope.recipe.hops.added,
                                   scope.recipe.grains.added,
                                   scope.recipe.volume,
                                   scope.recipe.og())).to.equal(46.1);
    });
  });
});
