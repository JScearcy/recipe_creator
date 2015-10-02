describe('recipe creation', function(){
  var scope;
  var ctrl;
  beforeEach(module('recipeCreator'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('recipeMake', {$scope: scope});
    scope.user = {
      username: 'testUser'
    };
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
    it('addIngredient should add a grain to the recipe object', function(){
      scope.addIngredient({name: '2-Row'}, 'grains', 'grain');
      expect(scope.recipe.grains.added.length).to.be.above(0);
    });
    it('addIngredient should add a hop to the recipe object', function(){
      scope.addIngredient({name: 'Citra'}, 'hops', 'hop');
      expect(scope.recipe.hops.added.length).to.be.above(0);
    });
    it('addIngredient should not throw an error, or take any action', function(){
      expect(scope.addIngredient('', '', '')).to.be.empty;
    });
  });

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
        hopType: 'Boil'
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
    it('the recipe should have an IBU\'s number of 46.1', function(){
      expect(scope.recipe.hops.added.length).to.equal(1);
      expect(scope.recipe.hops.ibu(scope.recipe.hops.added,
                                   scope.recipe.grains.added,
                                   scope.recipe.volume,
                                   scope.recipe.og())).to.equal(46.1);
    });
    it('clear recipe button should reset the recipe with no grains/hops', function(){
      expect(scope.recipe.grains.added.length).to.equal(1);
      expect(scope.recipe.hops.added.length).to.equal(1);
      scope.clearCurrentRecipe(scope, recipeFunc);
      expect(scope.recipe.grains.added.length).to.equal(0);
      expect(scope.recipe.hops.added.length).to.equal(0);
    });
    it('should take an srm value and return a RBG value for the SRM', function(){
      var rgb = recipeFunc.srmToRgbArray(3)
      expect(rgb).to.be.an('Array');
      expect(rgb.length).to.equal(3);
      expect(rgb[0]).to.equal(236);
      expect(rgb[1]).to.equal(167);
      expect(rgb[2]).to.equal(75);
      rgb = recipeFunc.srmToRgbArray(0);
      expect(rgb[0]).to.equal(251);
      expect(rgb[1]).to.equal(192);
      expect(rgb[2]).to.equal(0);
      rgb = recipeFunc.srmToRgbArray({one: 1});
      expect(rgb[0]).to.equal(251);
      expect(rgb[1]).to.equal(192);
      expect(rgb[2]).to.equal(0);
      rgb = recipeFunc.srmToRgbArray('50');
      expect(rgb[0]).to.equal(251);
      expect(rgb[1]).to.equal(192);
      expect(rgb[2]).to.equal(0);
    });
    it('should take an srm value from previous func and return a css rgb string, if the function incorrect return default', function(){
      var rgb = recipeFunc.srmToRgbArray(3);
      var rgbCSS = recipeFunc.RgbArrayToCSS(rgb);
      expect(rgbCSS).to.be.a('string');
      expect(rgbCSS).to.equal('rgb(236, 167, 75);');
      rgbCSS = recipeFunc.RgbArrayToCSS('notCorrect');
      expect(rgbCSS).to.equal('rgb(251, 192, 0);');
    })
    it('should change the current recipe to the defined "saved" recipe', function(){
      scope.editRecipe({
        name: 'Test',
        efficiency: 70,
        attenuation: 70,
        volume: 1,
        grains:{
          added: [{
            name: 'Ashburne Mild',
            id: 2,
            lovi: 3,
            dp: 40,
            PPG: 1.025,
            weight: 10
          }]
        },
        hops: {
          added: [{
            Name: 'Amarillo',
            id: 2,
            Alpha_Acid: 8.5,
            hopTime: 10,
            weight: 1,
            hopType: 'Whirlpool'
          }]
        },
        notes: 'test notes',
        yeast: 'yeasts'
      }, scope, recipeFunc);
      expect(scope.recipe.name).to.equal('Test');
      expect(scope.recipe.grains.added.length).to.equal(1);
      expect(scope.recipe.grains.added[0].name).to.equal('Ashburne Mild');
      expect(scope.recipe.hops.added.length).to.equal(1);
      expect(scope.recipe.hops.added[0].Name).to.equal('Amarillo');
      expect(scope.selectedIndex).to.equal(0);
        })
    it('should add another hops ingredient as whirlpool and recalc to 58.84 ibu', function(){
      scope.addIngredient({
        Name: 'Amarillo',
        id: 2,
        Alpha_Acid: 8.5,
        hopTime: 10,
        weight: 1,
        hopType: 'Whirlpool'
      }, 'hops', 'hop');
      expect(scope.recipe.hops.added.length).to.equal(2);
      expect(scope.recipe.hops.ibu(scope.recipe.hops.added,
                                   scope.recipe.grains.added,
                                   scope.recipe.volume,
                                   scope.recipe.og())).to.equal(58.84);
    });
    it('should add another hops ingredient as dry and calc to 46.1 ibu', function(){
      scope.addIngredient({
        Name: 'Nugget',
        id: 3,
        Alpha_Acid: 10.5,
        hopTime: 7,
        weight: 1,
        hopType: 'Dry'
      }, 'hops', 'hop');
      expect(scope.recipe.hops.added.length).to.equal(2);
      expect(scope.recipe.hops.ibu(scope.recipe.hops.added,
                                   scope.recipe.grains.added,
                                   scope.recipe.volume,
                                   scope.recipe.og())).to.equal(46.1);
    });
    it('should have 0 ibu\'s after removing all hops and recalc', function(){
      scope.recipe.hops.added = [];
      expect(scope.recipe.hops.ibu(scope.recipe.hops.added,
                                   scope.recipe.grains.added,
                                   scope.recipe.volume,
                                   scope.recipe.og())).to.equal(0);
    })
    it('should add another grain ingredient that makes effPPG > 1.5 and SRM > 50', function(){
      scope.addIngredient({
        name: '2-Row (Brewer\'s Malt)',
        id: 1,
        lovi: 500,
        dp:140,
        PPG: 1.037,
        weight: 100
      }, 'grains', 'grain');
      expect(scope.recipe.og()).to.equal(1.5);
      expect(scope.recipe.srm()).to.equal(50);
    });
    it('should not have any OG/grain related calcs', function(){
      scope.recipe.grains.added = [];
      expect(scope.recipe.grains.added.length).to.equal(0);
      expect(scope.recipe.og()).to.equal(0);
      expect(scope.recipe.fg()).to.equal(0);
      expect(scope.recipe.srm()).to.equal(0);
      expect(scope.recipe.abv()).to.equal(0);
      expect(scope.recipe.dp()).to.equal(0);
    });
    it('should strip extra decimals from rounding error', function(){
      scope.recipe.grains.added = [];
      scope.addIngredient({
        name: '2-Row (Brewer\'s Malt)',
        id: 1,
        lovi: 1.8,
        dp:140,
        PPG: 1.037,
        weight: 13
      }, 'grains', 'grain');
      expect(scope.recipe.grains.added.length).to.equal(1);
      expect(scope.recipe.fg()).to.equal('1.015');
    });
    it('should save recipe and reset the scope.recipe element', inject(function($http, $httpBackend){
      expect(scope.recipe.grains.added.length).to.equal(1);

      $httpBackend
      .when('GET', '/grains')
      .respond(200);
      $httpBackend
      .when('GET', '/hops')
      .respond(200);
      $httpBackend
      .when('GET', '/yeasts')
      .respond(200);
      scope.saveRecipe($http, scope, recipeFunc);
      $httpBackend
      .when('POST', '/private/recipes')
      .respond(200, scope.recipe);
      $httpBackend.flush();

      expect(scope.recipe.grains.added.length).to.equal(0);
      expect(scope.recipe.hops.added.length).to.equal(0);
      expect(scope.recipe.hops.ibu()).to.equal(0);
      expect(scope.recipe.og()).to.equal(0);
      expect(scope.recipe.fg()).to.equal(0);
      expect(scope.recipe.srm()).to.equal(0);
      expect(scope.recipe.abv()).to.equal(0);
      expect(scope.recipe.dp()).to.equal(0);
    }));
  });
});
