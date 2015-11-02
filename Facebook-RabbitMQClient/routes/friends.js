/**
 * New node file
 */
var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.addFriend=function(req,res){
	var msg_payload={
			operation:"add",
			message :{
				username : req.body.userName,
				toUser : req.body.toUser
			}
	};

	mq_client.make_request('friends_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in friends.js addFriend line 21: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};

exports.confirmFriend=function(req,res){
	var msg_payload={
			operation:"confirm",
			message :{
				username : req.body.userName,
				withUser : req.body.withUser
			}
	};
	mq_client.make_request('friends_queue',msg_payload,function(err,results){
		console.log("in get interest client"+results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in friends.js confirmFriend line 47: "+results.value);
			res.status(200).json({
				message : "success"
			});
		} 
	});
};

exports.getFriendList=function(req,res){
	var msg_payload={
			operation:"getList",
			message :{
				username : req.params.userName
			}
	};

	mq_client.make_request('friends_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("results.data : "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});
};

exports.getPendingFriendsList=function(req,res){
	var msg_payload={
			operation:"getPendingList",
			message:{
				username : req.params.userName
			}
	};
	mq_client.make_request('friends_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});
};

exports.checkFriendRequest=function(req,res){
	var msg_payload={
			operation:"checkFriendRequest",
			message:{
				user1 : req.params.user1,
				user2 : req.params.user2
			}
	};
	mq_client.make_request('friends_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});	
};

exports.getAll=function(req,res){
	var msg_payload={
			operation:"getAll",
			message:{
				username : req.params.userName
			}
	};
	mq_client.make_request('friends_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});	
};