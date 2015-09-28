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
    if(og > 0) {
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
  this.newGrain = function(grainObj) {
    this.PPG = grainObj.PPG;
    this.charandApps = grainObj.charandApps;
    this.dp = grainObj.dp;
    this.flavor = grainObj.flavor;
    this.id = grainObj.id;
    this.lovi = grainObj.lovi;
    this.name = grainObj.name;
    this.weight= grainObj.weight;
  };
  this.newHop = function(hopObj) {
    this.Alpha_Acid = hopObj.Alpha_Acid;
    this.Beta_Acid = hopObj.Beta_Acid;
    this.Name = hopObj.Name;
    this.Notes = hopObj.Notes;
    this.Origin = hopObj.Origin;
    this.Type = hopObj.Type;
    this.hopTime = hopObj.hopTime;
    this.hopType = hopObj.hopType;
    this.weight = hopObj.weight;
  };
  this.recipe = function(scope, recipeFunc) {
    this.efficiency = 65;
    this.attenuation = 75;
    this.volume = 5;
    this.grains = {
      added: []
    };
    this.hops = {
      added: [],
      ibu: function(){
        return recipeFunc.ibu(scope.recipe.hops.added, scope.recipe.grains.added, scope.recipe.volume, scope.recipe.og());
      }
    };
    this.og = function(){
      return recipeFunc.efficiencyPPG(recipeFunc.totalPPG(scope.recipe.grains.added, scope.recipe.volume), scope.recipe.efficiency)
    };
    this.fg = function(){
      return recipeFunc.fg(scope.recipe.grains.added, scope.recipe.og(), scope.recipe.attenuation)
    };
    this.abv = function() {
        return recipeFunc.abv(scope.recipe.grains.added, scope.recipe.og(), scope.recipe.fg());
      };
    this.srm = function() {
        return recipeFunc.srm(scope.recipe.grains.added, scope.recipe.volume);
      };
    this.dp = function() {
        return recipeFunc.dp(scope.recipe.grains.added, recipeFunc.totalWeight(scope.recipe.grains.added));
      };
    this.notes = '';
    this.recipeyeast =  scope.yeast;
  };

  this.calculateStats = function(recipe, recipeFunc) {
    recipe.og = recipeFunc.efficiencyPPG(recipeFunc.totalPPG(recipe.grains.added, recipe.volume), recipe.efficiency);
    recipe.fg = recipeFunc.fg(recipe.grains.added, recipe.og, recipe.attenuation);
    recipe.abv = recipeFunc.abv(recipe.grains.added, recipe.og, recipe.fg);
    recipe.srm = recipeFunc.srm(recipe.grains.added, recipe.volume);
    recipe.dp = recipeFunc.dp(recipe.grains.added, recipeFunc.totalWeight(recipe.grains.added));
    recipe.hops.ibu = recipeFunc.ibu(recipe.hops.added, recipe.grains.added, recipe.volume, recipe.og);
    return recipe;
  };
  this.getItem = function(http, scope, item) {
    http({
      method: 'GET',
      url: '/' + item
    }).then(function(res) {
      scope[item] = res.data;
    });
  };
  this.saveRecipe = function(http, scope, recipeFunc) {
    var recipe = {
      username: scope.user.username,
      name: scope.recipe.name,
      grains: {
        added: scope.recipe.grains.added
      },
      efficiency: scope.recipe.efficiency,
      volume: scope.recipe.volume,
      attenuation: scope.recipe.attenuation,
      hops: {
        added: scope.recipe.hops.added
      },
      notes: scope.notes,
      yeast: scope.yeast
    };
    http({
      method: 'post',
      url: '/private/recipes',
      data: recipe
    }).then(function(res){
      scope.recipe = new recipeFunc.recipe(scope, recipeFunc);
    })
  }
});

app.service('PpgCalc', function (){
  this.calcPpg = function(dbfg) {
    return (1000 * (1 + (dbfg / 100) * 0.04621)) / 1000
  }
});
