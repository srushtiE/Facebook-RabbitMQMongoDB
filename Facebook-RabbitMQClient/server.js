var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session = require('client-sessions');
//var session = require('express-session'); 
//var mysql = require('./routes/mysql');
var routes = require('./routes/index');
var users = require('./routes/users');
var overview = require('./routes/overview');
var interests = require('./routes/interests');
var newsfeeds = require('./routes/newsfeeds');
var friends = require('./routes/friends');
var groups = require('./routes/groups');

var http = require('http');
var path = require('path');
var app = express();

// initializing db connection pool
//mysql.createConnPool();

//session
/*app.use(session({
	cookieName: 'session',
	secret : 'sjsu010726287',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000
})); 
*/
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon1.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware to validate session
/*function checkSession(req, res, next) { 	
	if(req.session.user){
		users.requireLogin(function(resp){
			if(resp.value==1){
				// middleware processed, run the route
				next();
			}
			else{
				res.redirect('/');
			}
		},req);
	}
	else{
		res.redirect('/');
	}
} */


app.get('/templates/:file', routes.signUp);
app.get('/addUser',routes.signUp);
app.get('/logout',routes.logout);
app.get('/home',routes.logIn);
app.post('/api/signUp',users.signUp);
app.post('/api/logIn',users.logIn);
app.post('/api/addOverviewDetails',overview.addOverviewDetails);
app.get('/api/showOverview/:userName',overview.showOverview);
app.get('/api/showOverviewDetails/:userName/:ovid',overview.showOverviewDetails);
app.get('/api/getInterests/:category',interests.getInterests);
app.get('/api/getUserInterests/:userName',interests.getUserInterests);
app.post('/api/addUserInterests',interests.addUserInterests);
app.post('/api/postNewsFeeds',newsfeeds.postNewsFeeds);
app.get('/api/getNewsFeeds/:userName',newsfeeds.getNewsFeeds);
app.get('/api/getFriendList/:userName',friends.getFriendList);
app.get('/api/getPendingFriendsList/:userName',friends.getPendingFriendsList);
app.post('/api/confirmFriend',friends.confirmFriend);
app.get('/api/showGroupList/:userName',groups.showGroupList);
app.get('/api/showMembers/:groupName',groups.showMembers);
app.post('/api/confirmMember',groups.confirmMember);
app.get('/api/getGroupAdmin/:groupName',groups.getGroupAdmin);
app.get('/api/getPendingRequests/:groupName',groups.getPendingRequests);
app.post('/api/deleteMember',groups.deleteMember);
app.post('/api/deleteGroup',groups.deleteGroup);
app.post('/api/addGroup',groups.addGroup);
app.post('/api/addMember',groups.addMember);
app.post('/api/addFriend',friends.addFriend);
app.get('/api/checkFriendRequest/:user1/:user2',friends.checkFriendRequest);
app.get('/api/getAll/:userName',friends.getAll);
/*app.post('/api/logOut',users.logOut);*/
app.use('/', routes.views);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


//error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
