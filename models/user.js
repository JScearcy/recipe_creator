// TODO Finish a method for creating/updating user and recipes.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var SALT_WORK_FACTOR = 8;

var RecipeSchema = new Schema ({
  name: {type: String, required: true},
  grains: {added: Array, required: true},
  efficiency: {type: Number, required: true},
  volume: {type: Number, required: true},
  attenuation: {type: Number, required: true},
  hops: {added: {type: Array, required: true}},
  notes: String
});

var UserSchema = new Schema ({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  first_name: {type: String, required: true},
  last_name: {type: String}
});

UserSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if (err) {
      next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash){
      if (err){
        next(err);
      }
      user.password = hash;
      next();
    })
  })
});

UserSchema.methods.comparePassword = function(testPass, callback){
  bcrypt.compare(testPass, this.password, function(err, match) {
    if (err) callback(err);
    return callback(null, match);
  });
};

UserSchema.statics.userAuth = function (user, callback) {
    console.log('getAuthenticated', user);
    this.findOne({username: user.username}, function (err, doc) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        else if (!doc) {
            console.log('No user found,');
            return callback(new Error('Invalid username or password.', 401), null);
        }
        else {
            // test for a matching password
            doc.comparePassword(user.password, function (err, isMatch) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                // check if the password was a match
                if (isMatch) {
                  var user = {
                      username: doc.username,
                      id: doc.id,
                      firstName: doc.firstName,
                      lastName: doc.lastName
                  };
                  // return the jwt
                  var token = jsonwebtoken.sign(user, 'supersecret', {
                      expiresInMinutes: 1440 // expires in 24 hours
                  });
                  return callback(null, token, user);
                  }
                else {
                    return callback(new Error('Invalid username or password.'), null);

                }
            });
        }
    });
};
