/**
 * New node file
 */
var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.addGroup=function(req,res){
	var msg_payload={
			operation:"addGroup",
			message:{
				username : req.body.userName,
				groupname : req.body.groupName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in groups.js addGroup line 21: "+results.data);
			console.log("results.data : "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});
};

exports.showGroupList=function(req,res){
	var msg_payload={
			operation:"getList",
			message:{
				username : req.params.userName
			}
	};
	
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
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


exports.showMembers=function(req,res){
	var msg_payload={
			operation:"showMembers",
			message:{
				groupname : req.params.groupName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
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

exports.getGroupAdmin=function(req,res){
	var msg_payload={
			operation:"getAdmin",
			message:{
				username : req.params.userName
			}
	};
	
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
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

exports.getGroupAdmin=function(req,res){
	var msg_payload={
			operation:"getAdmin",
			message:{
				groupname : req.params.groupName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
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
exports.getPendingRequests=function(req,res){
	var msg_payload={
			operation:"getPendingRequests",
			message:{
				groupname : req.params.groupName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("results.data in getpendingrequests: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});	
};

exports.confirmMember=function(req,res){
	var msg_payload={
			operation:"confirmMember",
			message:{
				groupname : req.body.groupName,
				username : req.body.userName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in groups.js confirmMember line 137: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};

exports.deleteMember=function(req,res){
	var msg_payload={
			operation:"deleteMember",
			message:{
				groupname : req.body.groupName,
				username : req.body.userName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in groups.js deleteMember line 156: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};

exports.deleteGroup=function(req,res){
	var msg_payload={
			operation:"deleteGroup",
			message:{
				groupname : req.body.groupName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in groups.js deleteGroup line 178: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};

exports.addMember=function(req,res){
	var msg_payload={
			operation:"addMember",
			message:{
				groupname : req.body.groupName,
				username : req.body.userName
			}
	};
	mq_client.make_request('groups_queue',msg_payload,function(err,results){
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in groups.js addMember line 201: "+results.data);
			res.status(200).json({
				message : "success",
				data : results.data
			});
		} 
	});
};