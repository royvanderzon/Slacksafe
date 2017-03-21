var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var request = require('request');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongojs = require('mongojs');
var connectionString = '127.0.0.1:27017/minor-funda-server'
    // var connectionString = 'localhost:27017/minor-funda-server'

var databaseUrl = "127.0.0.1:27017/minor-funda-server";


var slacksafe = {
    insertSlackTeam: function(data, cb) {
        var db = mongojs(databaseUrl, ["teams"]);
        db.teams.save(data, function(err, saved) {
            if (err || !saved) {
                console.log(err)
                console.log("Record not saved");
            } else {
                console.log("Record saved");
                if (typeof cb === 'function') {
                    cb()
                }
            }
        });
    },
    findSlackTeam: function(search, cb) {
        var db = mongojs(databaseUrl, ["teams"]);
        // find everything, but sort by name 
        db.teams.find(search, function(err, docs) {
            if (typeof cb === 'function') {
                cb(err, docs)
            }
        })
    },
    findTeamById: function(id, cb) {
        var db = mongojs(databaseUrl, ["teams"]);
        db.teams.findOne({
            _id: mongojs.ObjectId(id)
        }, function(err, docs) {
            if (typeof cb === 'function') {
                cb(err, docs)
            }
        })
    },
    findUser: function(team_id, user_id, cb) {
        slacksafe.findTeamById(team_id, function(err, docs) {
            //get user from members
            function findUser(user) {
                return user.id == user_id
            }

            var thisUser = docs.user.members.find(findUser)
            if (typeof cb === 'function') {
                cb(thisUser)
            }
        })
    },
    setHackedUser: function(team_id, user_id, hacked, cb) {

        //set db
        var db = mongojs(databaseUrl, ["teams"]);
        //get user obj
        slacksafe.findTeamById(team_id, function(err, docs) {
            //get user from members
            function findUser(user) {
                return user.id == user_id
            }
            var thisUser = docs.user.members.find(findUser)

            thisUser.hacked = hacked
            db.teams.update({ _id: mongojs.ObjectId(team_id), 'user.members.id': user_id }, { '$set': { 'user.members.$': thisUser } }, function(err, response) {
                console.log(err)
                console.log(response)
                    // the update is complete
                console.log('updated')
                if (typeof cb === 'function') {
                    cb()
                }
            })
        })

        // find all named 'mathias' and increment their level 
        // db.getCollection('teams').update({_id:ObjectId("58cfe8bc5ce51f2f188ec594"),'user.members.id':'U41JD7AAF'},{'$set':{'user.members.$':{'name':'testtttt'}}})


    },
    checkPowned: function(email, cb) {

        var options = {
            url: 'https://haveibeenpwned.com/api/v2/breachedaccount/' + email,
            headers: {
                'User-Agent': 'request'
            }
        }

        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                cb(error, response.statusCode, body)
            }
        });

    },
    sortData: function(filtering, data) {
            switch (filtering) {
                case 'reverse':
                    data.reverse()
                    break;
                case 'name':
                    data.sort(function(a, b) {
                        if (String(a.profile.last_name).toLowerCase() < String(b.profile.last_name).toLowerCase()) return -1;
                        if (String(a.profile.last_name).toLowerCase() > String(b.profile.last_name).toLowerCase()) return 1;
                        return 0;
                    })
                    break;
                case 'color':
                    data.sort(function(a, b) {
                        if (a.color < b.color) return -1;
                        if (a.color > b.color) return 1;
                        return 0;
                    })
                    break;
                case 'email':
                    data.sort(function(a, b) {
                        if (String(a.profile.email).toLowerCase() < String(b.profile.email).toLowerCase()) return -1;
                        if (String(a.profile.email).toLowerCase() > String(b.profile.email).toLowerCase()) return 1;
                        return 0;
                    })
                    break;
                case 'hacked':
                    data.sort(function(a, b) {
                    	if(typeof a.hacked === 'object'){
                    		if (a.hacked.hacked) return -1;
                    		if (!a.hacked.hacked) return 1;
                    	}else{
                    		return 1;
                    	}
                    })
                    break;
                case 'save':
                    data.sort(function(a, b) {
                    	if(typeof a.hacked === 'object'){
                    		if (a.hacked.hacked) return 1;
                    		if (!a.hacked.hacked) return -1;
                    	}else{
                    		return 1;
                    	}
                    })
                    break;
                case 'checked':
                    data.filter(function(a) {
                    	console.log(typeof a.hacked)
                    	console.log(typeof a.hacked === 'object')
                    	return typeof a.hacked === 'object'
                    })
                    break;
                default:
                    //nothing happens
            }
            return data
        }
}

module.exports = slacksafe;
