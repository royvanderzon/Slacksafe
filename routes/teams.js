var express = require('express');
var slacksafe = require('../slacksafe');
var router = express.Router();

router.get('/', function(req,res){

	//find all teams
	slacksafe.findSlackTeam({}, function(err, docs) {

		//loop trough all teams
		docs.map(function(team){
			//set counters in team
			team.counters = {
				hacked : 0,
				save : 0,
				question : 0,
				total : 0,
				hackedPercent : 0,
				totalChecked : 0
			}
			//loop trough users in team
			team.user.members.map(function(member){

				if(member.profile.email){
					team.counters.total ++
					if(typeof member.hacked === 'object'){
	            		if (member.hacked.hacked){
		            		team.counters.hacked++
	            		}else{
		            		team.counters.save++
	            		}
	            	}else{
	            		team.counters.question++
	            	}
				}

			})

			//total hacked
			team.counters.totalChecked = team.counters.save + team.counters.hacked
			//total hacked percentage
			team.counters.hackedPercent = (100 * team.counters.hacked / team.counters.totalChecked).toFixed(2)
			//set color
			if(team.counters.hackedPercent == 'NaN'){
				//no result
				team.counters.color = 'rgb(200, 200, 200)'
			}else if(team.counters.hackedPercent > 75 && team.counters.hackedPercent >= 50){
				//very many hacked
				team.counters.color = 'rgb(182, 38, 38)'
			}else if(team.counters.hackedPercent < 50 && team.counters.hackedPercent >= 20){
				//many hacked
				team.counters.color = 'rgb(200, 72, 72)'
			}else if(team.counters.hackedPercent < 20 && team.counters.hackedPercent >= 15){
				//some hacked
				team.counters.color = 'rgb(246, 132, 23)'
			}else if(team.counters.hackedPercent < 15 && team.counters.hackedPercent >= 5){
				//few hacked
				team.counters.color = 'rgb(255, 177, 102)'
			}else if(team.counters.hackedPercent < 5){
				//mabey one or two hacked
				team.counters.color = 'rgb(63, 255, 35)'
			}

		})

		res.render('Teams',{
			title : 'Your teams',
			message : req.flash('message'),
			teams : docs
		})

    })
});

module.exports = router;