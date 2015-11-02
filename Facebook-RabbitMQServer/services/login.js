var mongo = require("../helper/mongo");
var mongoURL = "mongodb://localhost:27017/fbdb";

exports.redirect_operation=function(req,callback){
	var operation = req.operation;
	var message = req.message;
	
	switch(operation){
		case "login":
			login(message,callback);
			break;
		case "signup":
			signup(message,callback);
			break;
		case "logout":
			logout(message,callback);
			break;
		default :
			callback({status : 400,message : "Invalid Request"});
	}
};


function login(msg,callback){
	var res={};
	var username = msg.username;
	var password = msg.password;
	
	var json_responses;
	
	mongo.connect(mongoURL,function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection("login");
		
		coll.findOne({username: username, password:password}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.username;
				//console.log(req.session.username +" is the session");
				
				res.code = "200";
				res.value = "Success Login";
				console.log("Inside coll.find one "+res.value);
				//json_responses = {"statusCode" : 200};
				//res.send(json_responses);

			} else {
				console.log("returned false");
				res.code = "401";
				res.value = "Failed Login";
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
			}
			console.log("****************response*************** "+ JSON.stringify(res));
			callback(null, res);
		});
	});
}

function signup(msg,callback){
	var res={};
	
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("login");
		coll.insert({username: msg.username, password : msg.password, fname : msg.fname, lname : msg.lname, dob : msg.dob, gender : msg.gender}, function(err,result){
			if(err){
				res.code = "500";
				res.value = "Error while connecting!";
			}else{
				//console.log("WriteResult.nInserted :" +JSON.stringify(result));
				if(result.insertedCount>0){
					console.log("result.insertedCount : " + result.insertedCount);
					console.log("Document Inserted");
					res.code = "200";
					res.value = "Document Inserted";	
				}else{
					res.code="500";
					res.value = "Error while inserting document!";
				}
				
			}
			callback(null,res);
		});
	});
}