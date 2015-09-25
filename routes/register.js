var express = require('express');
var router = express.Router()
var User = require('../models/user');

//remove the password Information and add error information
function stripPassAddErr(userObj, error) {
  console.log(error);
  if (error){
    userObj.err = error;
  }
  userObj.password = '';
  userObj.passwordConfirm = '';
  return userObj
}

//when the registration form is sent in the body is checked for any issues with the input then checked for input,
//if any issues detected and error will be sent with the user object with an error added without passwords
router.post('/', function(req, res, next){
  req.checkBody('username', 'Invalid Username').isUsername();
  req.checkBody('password', 'Invalid Password').isPassword();
  req.checkBody('email', 'Invalid Email').isEmail();
  req.checkBody('first_name', 'Invalid Name').isName();
  req.checkBody('last_name', 'Invalid Name').isName();
  var errors = req.validationErrors();
  
  var userIn = req.body;
  if (userIn.password == undefined || userIn.username == undefined || userIn.first_name == undefined || userIn.email == undefined) {
    req.status(400).json(stripPassAddErr(userIn, 'Missing Information'));
  }else if(userIn.password !== userIn.passwordConfirm){
    res.status(400).json(stripPassAddErr(userIn, 'Passwords do not match'));
  } else if(errors) {
    req.status(400).json(stripPassAddErr(userIn, errors[0].msg));
  } else {
    User.Create(userIn, function(err, user){
      if (err) {
        console.log(err, user);
        res.status(400).send(stripPassAddErr(userIn, err));
      } else{
          user.password = '';
          user.passwordConfirm = '';
          res.json(user);
      }
    })
  }
})

module.exports = router;
