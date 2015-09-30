customValidators = {
  isUsername: function(value) {
    //test username and any other pattern needing letters, numbers, spaces, and _ .
    var userRegEx = /^[a-zA-Z0-9 _.]*[a-zA-Z0-9 _.][a-zA-Z0-9 _.]*$/;
    return userRegEx.test(value);
  },
  //test passwords for one letter, number, and special char within a pw 8-32 chars long
  isPassword: function(value) {
    var passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    return passRegEx.test(value);
  },
  isName: function(value) {
    //test for only letters and spaces
    var nameRegEx = /^[a-zA-Z ]*[a-zA-Z ][a-zA-Z ]*$/;
    return nameRegEx.test(value);
  },
  isIngredient: function(value) {
    //loop through array and return a true only when all objects within the array pass
    var ingredientRegEx = /^[a-zA-Z ()]*[a-zA-Z ()][a-zA-Z ()]*$/;
    value.forEach(function(elem){
      if(!ingredientRegEx.test(elem.name)) {
        return ingredientRegEx.test(elem.name);
      };
    });
    return true;
  },
  isObjectId: function(value) {
    var objectIdRegEx = /^[a-fA-F0-9]{24}$/;
    return objectIdRegEx.test(value);
  }
};

module.exports = customValidators;
