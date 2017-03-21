var express = require('express');
var slacksafe = require('../slacksafe');
var router = express.Router();

router.get('/:id', function(req, res) {

	//if session sorting isn't defined
	if(typeof req.session.sorting === 'undefined'){ console.log('hoi'); req.session.sorting = 'email'}
    slacksafe.findTeamById(req.params.id, function(err, docs) {
		docs.user.members = slacksafe.sortData(req.session.sorting,docs.user.members)
        res.render('user', {
            title: 'Emails: <strong>' + docs.team.team.name + '</strong>',
            message: req.flash('message'),
            users: docs,
            sorting : req.session.sorting
        })
    })
});

//set sorting to users choise
router.post('/:id', function(req, res) {
    req.session.sorting = req.body.sorting
    res.redirect('/user/'+req.params.id)
});

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
                	hacked : false,
					data : false                	
                }

                slacksafe.setHackedUser(team_id,user_id,hacked,function(){
			        req.flash('message', '<h3 class="err good">This email is save!</h3>')
			        res.redirect('/single/' + team_id + '/' + user_id)
                })

            } else if (statusCode == 200) {
                //there is some intel
                var hacked = {
                	hacked : true,
					data : JSON.parse(data)                	
                }

                slacksafe.setHackedUser(team_id,user_id,hacked,function(){
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

// "hacked": {
//     "hacked": false,
//     "id": "U40V0F1H6",
//     "email": "royvanderzon@gmail.com",
//     "data": false,
//     "response": "save"
// },
// "hackString": "success safe"


// "hacked": {
//     "hacked": true,
//     "id": "fsdue992fe",
//     "email": "test@gmail.com",
//     "data": [{
//         "Title": "000webhost",
//         "Name": "000webhost",
//         "Domain": "000webhost.com",
//         "BreachDate": "2015-03-01",
//         "AddedDate": "2015-10-26T23:35:45Z",
//         "PwnCount": 13545468,
//         "Description": "In approximately March 2015, the free web hosting provider <a href=\"http://www.troyhunt.com/2015/10/breaches-traders-plain-text-passwords.html\" target=\"_blank\" rel=\"noopener\">000webhost suffered a major data breach</a> that exposed over 13 million customer records. The data was sold and traded before 000webhost was alerted in October. The breach included names, email addresses and plain text passwords.",
//         "DataClasses": [
//             "Email addresses",
//             "IP addresses",
//             "Names",
//             "Passwords"
//         ],
//         "IsVerified": true,
//         "IsFabricated": false,
//         "IsSensitive": false,
//         "IsActive": true,
//         "IsRetired": false,
//         "IsSpamList": false,
//         "LogoType": "png"
//     }, {
//         "Title": "Yahoo",
//         "Name": "Yahoo",
//         "Domain": "yahoo.com",
//         "BreachDate": "2012-07-11",
//         "AddedDate": "2013-12-04T00:00:00Z",
//         "PwnCount": 453427,
//         "Description": "In July 2012, Yahoo! had their online publishing service &quot;Voices&quot; compromised via a SQL injection attack. The breach resulted in the disclosure of nearly half a million usernames and passwords stored in plain text. The breach showed that of the compromised accounts, a staggering <a href=\"http://www.troyhunt.com/2012/07/what-do-sony-and-yahoo-have-in-common.html\" target=\"_blank\" rel=\"noopener\">59% of people who also had accounts in the Sony breach reused their passwords across both services</a>.",
//         "DataClasses": [
//             "Email addresses",
//             "Passwords"
//         ],
//         "IsVerified": true,
//         "IsFabricated": false,
//         "IsSensitive": false,
//         "IsActive": true,
//         "IsRetired": false,
//         "IsSpamList": false,
//         "LogoType": "svg"
//     }],
//     "response": "hacked"
// },
// "hackString": "hacked danger 000webhost 000webhost.com 000webhost IsActive:true IsRetired:false IsSpamList:false IsVerified:true17Media 17app.co 17 IsActive:true IsRetired:false IsSpamList:false IsVerified:trueAdobe adobe.com Adobe IsActive:true IsRetired:false IsSpamList:false IsVerified:trueArmyForceOnline armyforceonline.com Army Force Online IsActive:true IsRetired:false IsSpamList:false IsVerified:trueBTSec forum.btcsec.com Bitcoin Security Forum Gmail Dump IsActive:true IsRetired:false IsSpamList:false IsVerified:trueBotOfLegends botoflegends.com Bot of Legends IsActive:true IsRetired:false IsSpamList:false IsVerified:trueBoxee forums.boxee.com Boxee IsActive:true IsRetired:false IsSpamList:false IsVerified:trueBTCE btc-e.com BTC-E IsActive:true IsRetired:false IsSpamList:false IsVerified:trueClixSense clixsense.com ClixSense IsActive:true IsRetired:false IsSpamList:false IsVerified:trueCOMELEC comelec.gov.ph COMELEC (Philippines Voters) IsActive:true IsRetired:false IsSpamList:false IsVerified:trueCrossFire cfire.mail.ru Cross Fire IsActive:true IsRetired:false IsSpamList:false IsVerified:trueDaniWeb daniweb.com DaniWeb IsActive:true IsRetired:false IsSpamList:false IsVerified:trueDLH dlh.net DLH.net IsActive:true IsRetired:false IsSpamList:false IsVerified:trueDominos pizza.dominos.be Domino's IsActive:true IsRetired:false IsSpamList:false IsVerified:trueDropbox dropbox.com Dropbox IsActive:true IsRetired:false IsSpamList:false IsVerified:trueElance elance.com Elance IsActive:true IsRetired:false IsSpamList:false IsVerified:trueFFShrine ffshrine.org Final Fantasy Shrine IsActive:true IsRetired:false IsSpamList:false IsVerified:trueFlashFlashRevolution flashflashrevolution.com Flash Flash Revolution IsActive:true IsRetired:false IsSpamList:false IsVerified:trueFunimation funimation.com Funimation IsActive:true IsRetired:false IsSpamList:false IsVerified:trueGamerzPlanet gamerzplanet.net Gamerzplanet IsActive:true IsRetired:false IsSpamList:false IsVerified:trueGamigo gamigo.com Gamigo IsActive:true IsRetired:false IsSpamList:false IsVerified:trueGawker gawker.com Gawker IsActive:true IsRetired:false IsSpamList:false IsVerified:trueGeekedIn geekedin.net GeekedIn IsActive:true IsRetired:false IsSpamList:false IsVerified:trueHemmelig hemmelig.com hemmelig.com IsActive:true IsRetired:false IsSpamList:false IsVerified:trueHeroesOfGaia heroesofgaia.com Heroes of Gaia IsActive:true IsRetired:false IsSpamList:false IsVerified:trueHeroesOfNewerth heroesofnewerth.com Heroes of Newerth IsActive:true IsRetired:false IsSpamList:false IsVerified:trueiMesh imesh.com iMesh IsActive:true IsRetired:false IsSpamList:false IsVerified:trueInsanelyi insanelyi.com Insanelyi IsActive:true IsRetired:false IsSpamList:false IsVerified:trueInterpals interpals.net InterPals IsActive:true IsRetired:false IsSpamList:false IsVerified:trueiPmart ipmart-forum.com iPmart IsActive:true IsRetired:false IsSpamList:false IsVerified:trueLastfm last.fm Last.fm IsActive:true IsRetired:false IsSpamList:false IsVerified:trueLeet leet.cc Leet IsActive:true IsRetired:false IsSpamList:false IsVerified:trueLifeboat lbsg.net Lifeboat IsActive:true IsRetired:false IsSpamList:false IsVerified:trueLinkedIn linkedin.com LinkedIn IsActive:true IsRetired:false IsSpamList:false IsVerified:trueLittleMonsters littlemonsters.com Little Monsters IsActive:true IsRetired:false IsSpamList:false IsVerified:trueLizardSquad lizardstresser.su Lizard Squad IsActive:true IsRetired:false IsSpamList:false IsVerified:trueLookbook lookbook.nu Lookbook IsActive:true IsRetired:false IsSpamList:false IsVerified:trueMangaTraders mangatraders.com Manga Traders IsActive:true IsRetired:false IsSpamList:false IsVerified:trueMinecraftPocketEditionForum minecraftpeforum.net Minecraft Pocket Edition Forum IsActive:true IsRetired:false IsSpamList:false IsVerified:trueMoneyBookers moneybookers.com Money Bookers IsActive:true IsRetired:false IsSpamList:false IsVerified:trueMPGH mpgh.net MPGH IsActive:true IsRetired:false IsSpamList:false IsVerified:truemSpy mspy.com mSpy IsActive:true IsRetired:false IsSpamList:false IsVerified:trueMySpace myspace.com MySpace IsActive:true IsRetired:false IsSpamList:false IsVerified:trueNeopets neopets.com Neopets IsActive:true IsRetired:false IsSpamList:false IsVerified:trueNeteller neteller.com Neteller IsActive:true IsRetired:false IsSpamList:false IsVerified:trueNextGenUpdate nextgenupdate.com NextGenUpdate IsActive:true IsRetired:false IsSpamList:false IsVerified:trueNexusMods nexusmods.com Nexus Mods IsActive:true IsRetired:false IsSpamList:false IsVerified:trueNihonomaru nihonomaru.net Nihonomaru IsActive:true IsRetired:false IsSpamList:false IsVerified:trueNulled nulled.cr Nulled IsActive:true IsRetired:false IsSpamList:false IsVerified:trueOnverse onverse.com Onverse IsActive:true IsRetired:false IsSpamList:false IsVerified:trueOwnedCore OwnedCore.com OwnedCore IsActive:true IsRetired:false IsSpamList:false IsVerified:truePatreon patreon.com Patreon IsActive:true IsRetired:false IsSpamList:false IsVerified:truePayAsUGym payasugym.com PayAsUGym IsActive:true IsRetired:false IsSpamList:false IsVerified:truePixelFederation pixelfederation.com Pixel Federation IsActive:true IsRetired:false IsSpamList:false IsVerified:truePlex plex.tv Plex IsActive:true IsRetired:false IsSpamList:false IsVerified:truePokebip pokebip.com Pokébip IsActive:true IsRetired:false IsSpamList:false IsVerified:truePSPISO pspiso.com PSP ISO IsActive:true IsRetired:false IsSpamList:false IsVerified:trueQIP qip.ru QIP IsActive:true IsRetired:false IsSpamList:false IsVerified:trueQuantumBooter quantumbooter.net Quantum Booter IsActive:true IsRetired:false IsSpamList:false IsVerified:trueQuinStreet quinstreet.com QuinStreet IsActive:true IsRetired:false IsSpamList:false IsVerified:trueR2Games r2games.com R2Games IsActive:true IsRetired:false IsSpamList:false IsVerified:trueRiverCityMedia rivercitymediaonline.com River City Media Spam List IsActive:true IsRetired:false IsSpamList:true IsVerified:trueSeedpeer seedpeer.eu Seedpeer IsActive:true IsRetired:false IsSpamList:false IsVerified:trueStarNet starnet.md StarNet IsActive:true IsRetired:false IsSpamList:false IsVerified:trueStratfor stratfor.com Stratfor IsActive:true IsRetired:false IsSpamList:false IsVerified:trueThisHabboForum thishabboforum.com ThisHabbo Forum IsActive:true IsRetired:false IsSpamList:false IsVerified:trueTianya tianya.cn Tianya IsActive:true IsRetired:false IsSpamList:false IsVerified:trueTrillian trillian.im Trillian IsActive:true IsRetired:false IsSpamList:false IsVerified:trueTumblr tumblr.com tumblr IsActive:true IsRetired:false IsSpamList:false IsVerified:trueVBulletin vbulletin.com vBulletin IsActive:true IsRetired:false IsSpamList:false IsVerified:trueVK vk.com VK IsActive:true IsRetired:false IsSpamList:false IsVerified:trueWarInc thewarinc.com War Inc. IsActive:true IsRetired:false IsSpamList:false IsVerified:trueWHMCS whmcs.com WHMCS IsActive:true IsRetired:false IsSpamList:false IsVerified:trueWin7Vista win7vista.com Win7Vista Forum IsActive:true IsRetired:false IsSpamList:false IsVerified:trueWishbone wishbone.io Wishbone IsActive:true IsRetired:false IsSpamList:false IsVerified:truexat xat.com xat IsActive:true IsRetired:false IsSpamList:false IsVerified:trueXbox360ISO xbox360iso.com Xbox 360 ISO IsActive:true IsRetired:false IsSpamList:false IsVerified:trueXbox-Scene xboxscene.com Xbox-Scene IsActive:true IsRetired:false IsSpamList:false IsVerified:trueXSplit xsplit.com XSplit IsActive:true IsRetired:false IsSpamList:false IsVerified:trueYahoo yahoo.com Yahoo IsActive:true IsRetired:false IsSpamList:false IsVerified:true"


module.exports = router;
