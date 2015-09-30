
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
//main page - the recipe creator
describe('recipe creation', function(){
  //reset the vars
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

      expect(scope.addIngredient()).to.not.be.ok;
    })
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

describe('PpgCalc test', function(){
  var scope;
  var ctrl;

  beforeEach(module('recipeCreator'));

  beforeEach(inject(function($rootScope, $controller, _PpgCalc_){
    scope = $rootScope.$new();
    ctrl = $controller('dbsgCalc', {$scope: scope});
    PpgCalc = _PpgCalc_;
  }));
  it('should return a value of 1.037 when 81 is input as the param and 1 if the input is NaN', function(){
    expect(PpgCalc.calcPpg(81)).to.equal('1.037');
    expect(PpgCalc.calcPpg('j')).to.equal('1');
  });
  it('should push a new item into scope.ppgItems with a new key of "ppg"', function(){
    scope.newItem = {
      name: 'test',
      dbfg: 81
    };
    scope.ppgItems = [];
    scope.addGrain(scope.newItem, PpgCalc);
    expect(scope.newItem.name).to.not.be.ok;
    expect(scope.newItem.dbfg).to.not.be.ok;
    expect(scope.ppgItems[0].name).to.equal('test');
    expect(scope.ppgItems[0].dbfg).to.equal(81);
    expect(scope.ppgItems[0].ppg).to.equal('1.037');
  });
  it('clearAll should take the list of ppgItems calculated and return no items', function(){
    scope.ppgItems.push({name: 'test1'});
    scope.ppgItems.push({name: 'test2'});
    expect(scope.ppgItems.length).to.equal(2);
    scope.clearAll();
    expect(scope.ppgItems.length).to.equal(0);
  });
});
