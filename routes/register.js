var express = require('express');
var router = express.Router()
var User = require('../models/user');

router.post('/', function(req, res, next){
  var user = req.body;
  if(user.password !== user.passwordConfirm){
    user.err = 'Password does not match!';
    user.password = '';
    user.passwordConfirm = '';
    res.json(user);
  } else {
    User.Create(user, function(err, user){
      if (err) res.send(err);
      user.password = '';
      user.passwordConfirm = '';
      res.json(user);
    })
  }
})

module.exports = router;
