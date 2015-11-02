/**
 * New node file
 */
var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.getInterests=function(req,res){
	var msg_payload={
			operation:"getInterests",
			message :{
				category : req.params.category
			}
	};
	mq_client.make_request('interest_queue',msg_payload,function(err,results){
		console.log("in get interest client"+results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in interests.js getInterests line 21: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};

exports.getUserInterests=function(req,res){
	var msg_payload={
			operation:"getUserInterests",
			message :{
				username : req.params.userName
			}
	};
	console.log("inside getUserInterests routes client");
	mq_client.make_request('interest_queue',msg_payload,function(err,results){
		console.log("in get user interest client"+results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in interests.js getUserInterests line 45: "+ JSON.stringify(results.data));
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};

exports.addUserInterests=function(req,res){
	var msg_payload={
			operation : "addUserInterests",
			message : {
				category: req.body.category,
				name: req.body.name,
				label: req.body.label,
				username: req.body.userName
			}
	};
	
	mq_client.make_request('interest_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in interests.js add");
			res.status(200).json({
				message : "success"
			});
		} 
	});
};