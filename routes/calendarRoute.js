var express = require('express');
var router = express.Router();
var models = require("../models");

router.get('/:id', function(req, res, next){
    models.Calendar.findAll();
});

router.post('/submit/', function(req, res, next){
    res.send('test');
});

module.exports = router;