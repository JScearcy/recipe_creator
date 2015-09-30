describe('PPG calculator', function(){
  var scope;
  var ctrl;

  beforeEach(module('recipeCreator'));

  beforeEach(inject(function($rootScope, $controller, _PpgCalc_){
    scope = $rootScope.$new();
    ctrl = $controller('dbsgCalc', {$scope: scope});
    PpgCalc = _PpgCalc_;
  }));
  it('should return a value of 1.037 when 81 is input as the DBFG param and 1 if the input is NaN', function(){
    expect(PpgCalc.calcPpg(81)).to.equal('1.037');
    expect(PpgCalc.calcPpg('j')).to.equal('1');
  });
  it('should push a new item into scope.ppgItems with a new key of "ppg", name of "test", ppg of "1.037", and dbfg of 81', function(){
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
