/*
 * Users related API's


//var mysql = require('./mysql');

//checking session into the table
exports.requireLogin = function(callback,req){

	var query = "select 1 from ?? where ?? = ?";
	var params = ['session_table','userid',req.session.user];
	var json_response;

	mysql.fetchData(function(err,results){
		if(err){
			// error scenario
			json_response = {
					'value' : 2 
			}; 
			callback(json_response);
		} else {
			if(results.length > 0){
				// success scenario
				json_response = { 
						'value' : 1
				}; 
				callback(json_response);
			}
			else {   
				// no such session exists
				json_response = { 
						'value' : 0
				};
				callback(json_response);
			}
		}
	},query,null,params,null);
};

// creating a session
exports.createSession = function(req){
	var query="insert into ?? values (?,now())";
	var params =['session_table',req.body.userName];

	mysql.fetchData(function(err,results){
		if(err){
			console.log("error occurred");
		}else{
			console.log("row inserted");
		}
	},query,null,params,null);

};

//sign up
exports.signUp = function(req,res){

	var query="insert into ?? values (?,now())";
	var params = ['session_table',req.body.userName];

	mysql.fetchData(function(err,results){
		if(err){
			console.log("error occurred");
		}else{
			console.log("row inserted");
		}
	},query,null,params,null);

	console.log(req.body);
	var query1 = "insert into ?? values (?,?)";
	var params1 = ['user_table',req.body.userName,req.body.password];

	var query2 = "insert into ?? values (?,?,?,STR_TO_DATE(?,'%m/%d/%Y'),?,now())";
	var params2 = ['userdetails_table',req.body.userName,req.body.fName,req.body.lName,req.body.dob,req.body.gender];

	mysql.fetchData(function(err,results,flag){
		if(err){
			res.status(500).json({
				message : "User Already Exists!"
			});
		}else{
			if(flag){
				req.session.user = req.body.userName;
				res.status(200).json({
					message : "success"
				});
			}
		}
	},query1,query2,params1,params2);

};

//log in 
exports.logIn = function(req,res){
	var query1 = "select ?? from ?? as ud,?? as u where ?? = ? and ?? = ? and ?? = ??";
	var params1 = ['fname','userdetails_table','user_table','u.userid',req.body.userName,'u.password',req.body.password,'ud.userid','u.userid' ];
	var query2 = "insert into ?? values (?,now())";
	var params2 = ['session_table',req.body.userName];

	mysql.fetchData(function(err,rows,flag) {
		console.log(rows);
		if(err){
			res.status(500).json({
				status : 500,
				message : "error"
			});
		}else{
			if(rows.length>0 || flag){
				var userFName = rows[0];

				mysql.fetchData(function(err,rows,flag){
					if(err){
						res.status(500).json({
							status : 500,
							message : "error"
						});
					}else{
						req.session.user = req.body.userName;
						res.status(200).json({
							data : userFName
						});
					}
				},query2,null,params2,null);

			}else{
				res.status(403).json({
					status : 403,
					message : "Invalid Credentials"
				});
			}
		}
	}, query1,null,params1,null);
};

//log out
exports.logOut = function(req,res){
	var query = "delete from ?? where ?? = ?";
	var params = ['session_table','userid',req.session.user];
	console.log("Query: " + query);

	mysql.fetchData(function(err, rows) {
		if(err){
			res.status(500).json({
				status : 500,
				message : "error"
			});
		}else{
			req.session.destroy();
			res.status(200).json({
				message : "success"
			});
		}
	}, query,null,params,null);
};*/

var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.logIn=function(req,res){

	var username=req.body.userName;
	var password=req.body.password;

	console.log("Inside users.js " + username + password);

	var msg_payload={
			operation : "login",
			message : {
				username : username,
				password : password
			}
	};

	mq_client.make_request('login_queue',msg_payload,function(err,results){
		console.log("inside make_request in users.js :" + JSON.stringify(results));
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				res.status(200).json({
					data : username
				});
				//res.send({"login":"Success"});

			}
			else {    

				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});
};

exports.signUp=function(req,res){

	var msg_payload={
			operation : "signup",
			message : {
				username : req.body.userName,
				password : req.body.password,
				fname : req.body.fName,
				lname : req.body.lName,
				dob : req.body.dob,
				gender : req.body.gender
			}
	};

	//console.log("Inside users.js " + username + password);
	mq_client.make_request('login_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			res.status(500).json({
				message : "User Already Exists!"
			});
		}else{
			console.log("Success in users.js signup");
			//req.session.user = req.body.userName;
			res.status(200).json({
				message : "success"
			});
		} 
	});
};
