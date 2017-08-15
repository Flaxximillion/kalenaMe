var models = require("../models");
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next){
    res.send('test');
});

router.post('/new', function(req, res){
  console.log(req.body);
  // console.log(models);
	models.tasks.create(req.body)
	.then(function(data) {
	    res.send('New task request accepted!');
	})
	.catch(function(err) {
		console.log(err);
	});
  // res.send("HI.");
});

module.exports = router;
