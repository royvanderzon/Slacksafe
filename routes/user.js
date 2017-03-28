var express = require('express');
var slacksafe = require('../slacksafe');
var router = express.Router();

router.get('/:id', function(req, res) {

    console.log(slacksafe.config.chekkingSafe.length)
    console.log(slacksafe.config.chekkingSafe)
    console.log(slacksafe.config.currentlyCheckking)

    //if session sorting isn't defined
    if (typeof req.session.sorting === 'undefined') {
        console.log('not found');
        req.session.sorting = 'email'
    }
    slacksafe.findTeamById(req.params.id, function(err, docs) {
        docs.user.members = slacksafe.sortData(req.session.sorting, docs.user.members)
        res.render('user', {
            title: 'Emails: <strong>' + docs.team.team.name + '</strong>',
            message: req.flash('message'),
            users: docs,
            sorting: req.session.sorting,
            team_id: req.params.id,
            chekkingSafe: slacksafe.config.chekkingSafe,
            currentlyCheckking: slacksafe.config.currentlyCheckking
        })
    })
});

//set sorting to users choise
router.post('/:id', function(req, res) {
    req.session.sorting = req.body.sorting
    res.redirect('/user/' + req.params.id)
});

router.get('/arewesafe/:id', function(req, res) {
    //if chekkingsafe is not already in use
    console.log(slacksafe.config.chekkingSafe.length)
    console.log(slacksafe.config.chekkingSafe)
    console.log(slacksafe.config.currentlyCheckking)
    if (slacksafe.config.chekkingSafe.length < 1) {
        slacksafe.findTeamById(req.params.id, function(err, docs) {
            //disable this link for a while
            slacksafe.config.chekkingSafe = docs.team.team.name
            slacksafe.config.currentlyCheckking = req.params.id

            var checkingUsersCount = 0;
            // console.log(docs.user.members)
            docs.user.members.map(function(el, index) {
                //check if already checkked and if has valid email
                if (typeof el.hacked !== 'object' && typeof el.profile.email === 'string') {
                    //counting all users to check
                    checkingUsersCount++


                    // console.log('///////////////////////////')
                    // console.log('email')
                    // console.log(el.profile.email)

                    // console.log('user ID')
                    // console.log(el.id)

                    // console.log('team ID')
                    // console.log(req.params.id)

                    setTimeout(function() {
                        checkUser(docs, req.params.id, el.id)
                        if (Number(index) == Number(checkingUsersCount - 1)) {
                            slacksafe.config.chekkingSafe = ''
                        }
                    }, 2500 * (index + 1))


                }
            })

            if(checkingUsersCount < 1){
                slacksafe.config.chekkingSafe = ''
                req.flash('message', '<h3 class="err warning">This list is already checkked</h3>')
                res.redirect('/user/' + req.params.id)
                return;   
            }else{
                req.flash('message', '<h3 class="err good">Chekking this Slack team!</h3>')
                res.redirect('/user/' + req.params.id)
            }
        })
    } else {
        req.flash('message', '<h3 class="err good">Sorry, we are checkking someone else first!</h3>')
        res.redirect('/user/' + req.params.id)
    }
})

router.get('/arewesafe/restart/:id', function(req, res) {

    slacksafe.config.chekkingSafe = ''
    res.redirect('/user/arewesafe/'+req.params.id)

})

//checks is user is hacked, redirect to some
router.get('/checkSafe/:team_id/:user_id', function(req, res) {
    var team_id = req.params.team_id
    var user_id = req.params.user_id
    slacksafe.findTeamById(team_id, function(err, docs) {
        //get user from members
        function findUser(user) {
            return user.id == user_id
        }
        var thisUser = docs.user.members.find(findUser)
        slacksafe.checkPowned(thisUser.profile.email, function(err, statusCode, data) {
            var statusCode = Number(statusCode)
            if (statusCode == 429) {
                //denied
                req.flash('message', '<h3 class="err">Request denied, please wait at lease 5 seconds!</h3>')
                res.redirect('/user/' + team_id)
            } else if (statusCode == 404) {
                //user was not hacked or unknown

                var hacked = {
                    hacked: false,
                    data: false
                }

                slacksafe.setHackedUser(team_id, user_id, hacked, function() {
                    req.flash('message', '<h3 class="err good">This email is save!</h3>')
                    res.redirect('/single/' + team_id + '/' + user_id)
                })

            } else if (statusCode == 200) {
                //there is some intel
                var hacked = {
                    hacked: true,
                    data: JSON.parse(data)
                }

                slacksafe.setHackedUser(team_id, user_id, hacked, function() {
                    req.flash('message', '<h3 class="err good">This email is hacked!</h3>')
                    res.redirect('/single/' + team_id + '/' + user_id)
                })

            } else {
                req.flash('message', '<h3 class="err good">Something wen\'t wrong, please try again..</h3>')
                res.redirect('/user/' + team_id)
            }

        })
    })
});

var checkUser = function(docs, team_id, user_id) {
    function findUser(user) {
        return user.id == user_id
    }
    var thisUser = docs.user.members.find(findUser)
    slacksafe.checkPowned(thisUser.profile.email, function(err, statusCode, data) {
        var statusCode = Number(statusCode)
        console.log('checkkingg')
        if (statusCode == 429) {
            //denied
            console.log('denied user: ' + user_id)
                // req.flash('message', '<h3 class="err">Request denied, please wait at lease 5 seconds!</h3>')
                // res.redirect('/user/' + team_id)
        } else if (statusCode == 404) {
            //user was not hacked or unknown

            var hacked = {
                hacked: false,
                data: false
            }

            //user was not hacked
            slacksafe.setHackedUser(team_id, user_id, hacked, function() {})

        } else if (statusCode == 200) {
            //there is some intel
            var hacked = {
                hacked: true,
                data: JSON.parse(data)
            }

            //user was hacked
            slacksafe.setHackedUser(team_id, user_id, hacked, function() {})

        } else {
            //something went horribly wrong..
            console.log('weird error..')
        }

    })
}

module.exports = router;
