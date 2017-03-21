var express = require('express');
var slacksafe = require('../slacksafe');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/:team_id/:user_id', function(req,res){

	var team_id = req.params.team_id;
	var user_id = req.params.user_id;

	slacksafe.findUser(team_id,user_id,function(result){
		console.log(typeof result)
		var title = 'No user found'
		if(typeof result === 'object') {
			title = result.profile.email
		}else{
			req.flash('message', '<h3 class="err">No email found..</h3>')
		}
		res.render('single', {
            title: title,
            message: req.flash('message'),
            user: result,
            team_id : team_id
        })
	})

});

module.exports = router;