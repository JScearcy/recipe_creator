app.service('recipeFunc', function(){
  //this calculates the weight of all grains added
  this.totalWeight = function(ingredients){
    var total = 0;
    ingredients.forEach(function(ingredient){
      if(ingredient.weight > 0){
        total += parseInt(ingredient.weight);
      };
    });
    return total;
  };
  //this calculates the max sugar extraction possible from the grains
  this.totalPPG = function(grains, volume){
    var total = 0;
    grains.forEach(function(grain, index){
      total += (Math.round((grain.PPG - 1) * 1000 * grain.weight / volume)) / 1000;
    });
    return total;
  };
  //this calculates the estimated sugar extraction based on user's eff. input
  this.efficiencyPPG = function(totalPPG, efficiency) {
    if(totalPPG === 0){
      return 0;
    } else {
        var effPPG = Math.round(totalPPG * (efficiency / 100) * 1000) / 1000 + 1;
        if(effPPG > 1.5) {
          effPPG = 1.5;
        }
        if(effPPG.toString().length > 5) {
          effPPG = effPPG.toString().slice(0, 5);
        };
        return effPPG;
      }
  };
  //calculates ibu's for user's input hops
  this.ibu = function(hops, grains, volume, og) {
    if(hops.length > 0 && grains.length > 0) {
      var ibu = 0;
      var aau = 0;
      var bigFact = 1.65 * Math.pow(0.000125, (og - 1));
      hops.forEach(function(hop) {
        aau = hop.weight * (hop.Alpha_Acid / 100) * 7490 / volume;
        if(hop.hopType == 'boil') {
          var boilTFact = ((1 - Math.pow(2.71828182845904523536, (-.04 * hop.hopTime))) / 3.8);
          var util = bigFact * boilTFact;
          ibu += util * aau;
        } else if(hop.hopType == 'whirlpool') {
          var util = .10;
          ibu += util * aau
        }
      });
      return Math.round(ibu * 100) / 100;
    }
    return 0;
  };
  //this calculates the final gravity based on attenuation
  this.fg = function(grains, og, attenuation){
    if(grains.length > 0) {
      var yeastFood = Math.round(((og - 1) * 1000) * (attenuation / 100)) / 1000;
      yeastFood = og - yeastFood;
      if(yeastFood.toString().length > 5) {
        yeastFood = yeastFood.toString().slice(0, 5);
      }
      return yeastFood;
    } else {
    return 0
    }
  };
      //estimate color based on grains added
  this.srm = function(grains, volume){
    if(grains.length > 0) {
      var totalColor = 0;
      var mcu = grains.forEach(function(grain, index) {
        totalColor += (grain.lovi * grain.weight);
      });
      mcu = totalColor / volume;
      mcu = Math.round((1.4922 * (Math.pow(mcu, 0.6859))) * 100) / 100;
      if(mcu > 50){
        mcu = 50;
      };
      return mcu;
      } else {
        return 0;
      }
    };
  this.abv = function(grains, og, fg){
    if(grains.length > 0) {
      return Math.round((76.08 * (og-fg) / (1.775 - og)) * (fg / 0.794) * 100) / 100;
    } else {
      return 0
    }
  };
  this.dp = function(grains, totalWeight){
    if(grains.length > 0) {
      var totaldp = 0;
      grains.forEach(function(grain, index) {
        totaldp += grain.dp * grain.weight;
      });
      return Math.round(totaldp / totalWeight);
    } else {
      return 0;
    }
  }
});
