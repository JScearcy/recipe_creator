var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/', function (req, res, next) {
    //validate input from front-end
    req.checkBody('username', 'Invalid Username or Password').isUsername();
    req.checkBody('password', 'Invalid Username or Password').isPassword();
    var error = req.validationErrors();
    //check for username/password and send back a bad status if there is anything wrong with the input, otherwise validate the user.
    if (req.body.username === undefined || !req.body.username.length) {
        console.log("Username Required.");
        res.status(400).send("Username Required.");
    } else if (req.body.password === undefined || !req.body.password.length) {
        console.log("Password Required.");
        res.status(400).send("Password Required.");
    } else if (error) {
        res.status(401).send(error[0].msg);
    } else {
        User.userAuth(req.body, function (err, token, user) {
            if (err) {
                console.log(err);
                res.status(401).send('Invalid Username or Password');
            }
            else if (token) {
                // We are sending the profile inside the token
                res.json({token: token, user: user});
            } else {
                res.status(401).send('Invalid Username or Password');
            }
        })
    }
});

module.exports = router;
