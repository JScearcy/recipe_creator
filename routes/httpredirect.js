var express = require('express');
var router = express.Router();

function requireHTTPS(req, res, next) {
    if (!req.secure) {
        console.log('not secure')
        var domain = "https://" + req.get("host");
        if (process.env["SSL_PORT"]) {
            domain = domain.replace(/:\d+$/, "");
            domain += ":" + process.env["SSL_PORT"];
        }
        return res.redirect(domain + req.url);
    }
    next();
}

router.get('/', function(req, res, next){
  console.log('not secure')
  requireHTTPS(req, res, next);
});

module.exports = router;
