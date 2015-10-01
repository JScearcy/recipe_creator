app.service('PpgCalc', function (){
  this.calcPpg = function(dbfg) {
    if(typeof dbfg !== 'number'){
      dbfg = 0;
    }
    dbfg = (1000 * (1 + (dbfg / 100) * 0.04621)) / 1000
    dbfg = dbfg.toString().slice(0, 5);
    return dbfg;
  };
  this.newItem = function (newItem, PpgCalc) {
    this.ppg = PpgCalc.calcPpg(newItem.dbfg);
    this.dbfg = newItem.dbfg;
    this.name = newItem.name;
  }
});
