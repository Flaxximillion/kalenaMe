var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', loggedIn, function (req, res, next) {
    console.log('test');
    res.render('index.hbs', {title: 'Kalena'});
});

function loggedIn(req, res, next){
    console.log(req.sessionID);
    req.session.reload(function(){
        if(req.session.uuid){
            res.redirect('/calendar')
        } else {
            next();
        }
    });
}

module.exports = router;
