// TODO Finish a method for updating user and recipes.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var SALT_WORK_FACTOR = 8;

var UserSchema = new Schema ({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  email: {type: String, required: true, index: {unique: true}},
  first_name: {type: String, required: true},
  last_name: {type: String},
  username_lower: {type: String, required: true, index: {unique: true}}
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

UserSchema.statics.Create = function(user, callback) {
  this.findOne({username_lower: user.username.toLowerCase()}, function(err, exists){
    if (err) return callback(err);
    if (exists) return callback('User already exists', null);
    this.find({email: user.email}, function(err, exists){
        if (err) return callback(err);
        if (exists.length > 0) {
          return callback('Email already used', null);
        } else {
          var User = mongoose.model('User', UserSchema);
          var newUser = new User({
            username: user.username,
            password: user.password,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username_lower: user.username.toLowerCase()
          });
          newUser.save(function(err, newUser){
            if(err) return callback(err);
            return callback(null, newUser);
          })
      }
    })
  })
}

UserSchema.methods.comparePassword = function(testPass, callback){
  bcrypt.compare(testPass, this.password, function(err, match) {
    if (err) callback(err);
    return callback(null, match);
  });
};

UserSchema.statics.userAuth = function (user, callback) {
    this.findOne({username_lower: user.username.toLowerCase()}, function (err, doc) {
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
                  var token = jsonwebtoken.sign(user, process.env.SECRET, {
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

module.exports = mongoose.model('User', UserSchema)
