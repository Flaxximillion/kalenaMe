var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('createGroup.hbs');
});

router.post('/', jsonParser, function(req, res, next){
    console.log(req.body);
});



module.exports = router;