//super simple rpc server example
var amqp = require('amqp');
//var util = require('util');

var login = require('./services/login');
var overview = require('./services/overview');
var interest = require('./services/interests');
var feed = require('./services/newsfeeds');
var friends = require('./services/friends');
var groups = require('./services/groups');
var express = require('express');
var cnn = amqp.createConnection({host:'127.0.0.1'});
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./helper/mongo");

var app = express();

app.use(expressSession({
	secret: 'sjsu010726287',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	/*http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	}); */ 
});


cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			/*util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));*/
			console.log("inside server server.js");
			login.redirect_operation(message, function(err,res){
				console.log("res in redirect_operation : "+res);
				publishQueue(cnn,m,res);
			});
		});
	});
	
	cnn.queue('overview_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("inside server server.js");
			overview.redirect_operation(message, function(err,res){
				console.log("res in redirect_operation overview: "+res);
				publishQueue(cnn,m,res);
			});
		});
	});
	
	cnn.queue('interest_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("inside server server.js");
			interest.redirect_operation(message, function(err,res){
				console.log("res in redirect_operation interest: "+res);
				publishQueue(cnn,m,res);
			});
		});
	});
	
	cnn.queue('newsfeeds_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("inside server server.js");
			feed.redirect_operation(message, function(err,res){
				console.log("res in redirect_operation feed: "+res);
				publishQueue(cnn,m,res);
			});
		});
	});
	
	cnn.queue('friends_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("inside server server.js");
			friends.redirect_operation(message, function(err,res){
				console.log("res in redirect_operation feed: "+res);
				publishQueue(cnn,m,res);
			});
		});
	});
	
	cnn.queue('groups_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("inside server server.js");
			groups.redirect_operation(message, function(err,res){
				console.log("res in redirect_operation groups: "+res);
				publishQueue(cnn,m,res);
			});
		});
	});
});

//return index sent
function publishQueue(cnn,m,res){
	console.log("res in publishQueue : "+res);
	cnn.publish(m.replyTo, res, {
		contentType:'application/json',
		contentEncoding:'utf-8',
		correlationId:m.correlationId
	});
}