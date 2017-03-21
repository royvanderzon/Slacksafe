// server.js
global.__base = __dirname + '/';
// set up ======================================================================
// get all the tools we need
var express = require('express');
var slacksafe = require('./slacksafe');
var app = express();

var port = process.env.PORT || 3000; //8080
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// set router ================================================================
var tokenRoutes = require('./routes/get_token');
var teamsRoutes = require('./routes/teams');
var userRoutes = require('./routes/user');
var singleRoutes = require('./routes/single');

app.use(express.static('public')); // to add CSS

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
// app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'sdfsdf289r2H(*)&$H#*(24trfwef(*H))&+RF',
    saveUninitialized: true,
    resave: false
}));

// Ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(flash()); // use connect-flash for flash messages stored in session

//give router
app.use('/teams', teamsRoutes);
app.use('/user', userRoutes);
app.use('/get_token', tokenRoutes);
app.use('/single', singleRoutes);

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Home',
        message: req.flash('message')
    })
})

// launch ======================================================================
app.listen(port);
console.log('Performance Matters started on port: ' + port);
