/**
 * New node file
 */
var mongo = require("../helper/mongo");
var mongoURL = "mongodb://localhost:27017/fbdb";

exports.redirect_operation=function(req,callback){
	var operation = req.operation;
	var message = req.message;

	switch(operation){
	case "add":
		addFriend(message,callback);
		break;
	case "confirm":
		confirmFriend(message,callback);
		break;
	case "getList":
		getFriendList(message,callback);
		break;
	case "getAll":
		getAll(message,callback);
		break;
	case "getPendingList":
		getPendingFriendsList(message,callback);
		break;
	case "checkFriendRequest":
		checkFriendRequest(message,callback);
		break;
	default :
		callback({status : 400,message : "Invalid Request"});
	}
};

function addFriend(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("friends");
		coll.insert({user_one: msg.username, user_two: msg.toUser , status: 1,timestamp : new Date()}, function(err,result){
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

function confirmFriend(msg,callback){
	console.log("in confirmFriend services"+JSON.stringify(msg));
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("friends");
		coll.update({user_two:msg.username,user_one:msg.withUser},{$set:{status:2}},function(err,result){
			if(err){
				res.code = "500";
				res.value = "Error while connecting!";
			}else{
				if(result.ok==1){
					res.code="200";
					res.value ="Document Updated";
					console.log("**Update** "+JSON.stringify(result));
				}else{
					res.code = "304";
					res.value = "error in update";
				}
			}
			callback(null,res);
		});
	});
}

function getFriendList(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("friends");
		coll.find({$or:[{user_one:msg.username,status:2},{user_two:msg.username,status:2}]},{_id:0,user_one:1,user_two:1}).toArray(function(err,result){
			if(err){
				res.data = "Error Occurred!";
				console.log("Error");
			}else{
				var temp=[];
				for(var i=0;i<result.length;i++){
					if(!(((msg.username).localeCompare(result[i].user_one))==0)){
						temp.push(result[i].user_one);
					}
					if(!(((msg.username).localeCompare(result[i].user_two))==0)){
						temp.push(result[i].user_two);
					}
				}
				res.data=temp;
			}
			callback(null,res);
		});
	});
}

function getPendingFriendsList(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("friends");
		coll.find({user_two:msg.username,status:1}).toArray(function(err,result){
			if(err){
				console.log("error");
			}else{
				var temp=[];
				for(var i=0;i<result.length;i++){
					temp.push(result[i].user_one);
				}
				res.data=temp;
			}
			callback(null,res);
		});
	});
}

function checkFriendRequest(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("friends");
		coll.find({$or:[{user_one:msg.user1,user_two:msg.user2},{user_two:msg.user1,user_one:msg.user2}]},{user_two:1,status:1,_id:0}).toArray(function(err,result){
			if(err){
				console.log("error");
				res.data = "Error!";
			}else{
				var temp=[];
				for(var i=0;i<result.length;i++){
					temp.push({
						"list":{
							"username":result[i].user_two,
							"status":result[i].status
						}
					});
				}
				res.data=temp;
			}
			callback(null,res);
		});
	});
}

function getAll(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll1 = mongo.collection("friends");
		var coll2 = mongo.collection("groups");
		coll1.find({},{_id:0,user_one:1,user_two:1}).toArray(function(err,result){
			if(err){
				res.data = "Error Occurred!";
				console.log("Error");
			}else{
				var temp=[];
				for(var i=0;i<result.length;i++){
					if(!(((msg.username).localeCompare(result[i].user_one))==0)){
						temp.push(result[i].user_one);
					}
					if(!(((msg.username).localeCompare(result[i].user_two))==0)){
						temp.push(result[i].user_two);
					}
				}
				coll2.find({},{_id:0,groupname:1}).toArray(function(err,result){
					if(err){
						res.data = "Error Occurred!";
						console.log("Error");
					}else{
						console.log("result in coll2 getall :"+result)
						for(var i=0;i<result.length;i++){
							temp.push(result[i].groupname);
							console.log("result[i].groupname: "+result[i].groupname);
						}
					}
					console.log("res.data in getAll: "+ temp);
					res.data=temp;
					callback(null,res);
				});
			}
			
		});
	});
}