var express = require('express');
var router = express.Router();
var models = require("../models");

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/:id', function(req, res, next){
    res.send('test');
});

router.post('/submit/', function(req, res, next){
    models.messages.create(req.body)
});

module.exports = router;