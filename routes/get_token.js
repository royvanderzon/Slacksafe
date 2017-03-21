var express = require('express');
var slacksafe = require('../slacksafe');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res) {

    res.render('get_token', {
        title: 'Add teams',
        message: req.flash('message')
    })

});

router.post('/token', function(req, res) {

    var teamToken = req.body.slackKeyInput

    slacksafe.findSlackTeam({
        token: teamToken
    }, function(err, docs) {

        if (docs.length > 0) {
            req.flash('message', '<h3 class="err bad">This token already exists!</h3>')
            res.redirect('/get_token')
            return;
        }

        request.post({ url: 'https://slack.com/api/users.list?token=' + teamToken, form: {} }, function(err, userList, body) {
            request.post({ url: 'https://slack.com/api/team.info?token=' + teamToken, form: {} }, function(err, teamInfo, body) {
                console.log(typeof JSON.parse(JSON.parse(JSON.stringify(teamInfo)).body))
                slacksafe.insertSlackTeam({
                    team: JSON.parse(JSON.parse(JSON.stringify(teamInfo)).body),
                    user: JSON.parse(JSON.parse(JSON.stringify(userList)).body),
                    token: teamToken
                }, function() {
                    req.flash('message', '<h3 class="err good">Key saved!</h3>')
                    res.redirect('/teams')
                })
            })
        })

    })

});

module.exports = router;
