/**
 * New node file
 */
var mongo = require("../helper/mongo");
var mongoURL = "mongodb://localhost:27017/fbdb";

exports.redirect_operation=function(req,callback){
	var operation = req.operation;
	var message = req.message;

	switch(operation){
	case "getList":
		getGroupsList(message,callback);
		break;
	case "showMembers":
		showMembers(message,callback);
		break;
	case "getAdmin":
		getGroupAdmin(message,callback);
		break;
	case "getPendingRequests":
		getPendingRequests(message,callback);
		break;
	case "addGroup":
		addGroup(message,callback);
		break;
	case "deleteGroup":
		deleteGroup(message,callback);
		break;
	case "addMember":
		addMember(message,callback);
		break;
	case "confirmMember":
		confirmMember(message,callback);
		break;
	case "deleteMember":
		deleteMember(message,callback);
		break;
	default :
		callback({status : 400,message : "Invalid Request"});
	}
};

function getGroupsList(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("groups");
		coll.find({member : msg.username}).toArray(function(err,result){
			if(err){
				res.data = "Error Occurred!";
				console.log("Error");
			}else{
				var temp=[];
				for(var i=0;i<result.length;i++){
					temp.push(result[i].groupname);
				}
				res.data=temp;
			}
			callback(null,res);
		});
	});
}

function showMembers(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("groups");
		coll.find({groupname : msg.groupname,status:2}).toArray(function(err,result){
			if(err){
				res.data = "Error Occurred!";
				console.log("Error");
			}else{
				var temp=[];
				for(var i=0;i<result.length;i++){
					temp.push(result[i].member);
				}
				res.data=temp;
			}
			callback(null,res);
		});
	});
}

function getGroupAdmin(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("groups");
		coll.find({groupname : msg.groupname},{created_by:1,_id:0}).toArray(function(err,result){
			if(err){
				res.data = "Error Occurred!";
				console.log("Error");
			}else{
				res.data=result;
				//	console.data("result in getgroupadmin: "+JSON.stringify(result));
				console.log("res.data in getgroupadmin: "+ res.data);
			}
			callback(null,res);
		});
	});
}

function getPendingRequests(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("groups");
		coll.find({groupname : msg.groupname,status:1},{member:1,_id:0}).toArray(function(err,result){
			if(err){
				res.data = "Error Occurred!";
				console.log("Error");
			}else{
				console.log("getPendingRequests result: "+result.member);
				var temp=[];
				for(var i=0;i<result.length;i++){
					temp.push(result[i].member);
					console.log("temp: "+temp[i]);
				}
				res.data=temp;
			}
			callback(null,res);
		});
	});
}

function confirmMember(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection("groups");
		coll.update({groupname : msg.groupname,member: msg.username},{$set:{status:2}},function(err,result){
			if(err){
				res.code = "500";
				res.value = "Error while connecting!";
			}else{
				res.code="200";
				res.value ="Document Updated";
				console.log("**Update** "+JSON.stringify(result));
			}
			callback(null,res);
		});
	});
}

function deleteMember(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection("groups");
		coll.remove({groupname : msg.groupname,member: msg.username},function(err,result){
			if(err){
				res.code = "500";
				res.value = "Error while connecting!";
			}else{
				res.code="200";
				res.value="Document removed";
			}
			callback(null,res);
		});
	});
}

function deleteGroup(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection("groups");
		coll.remove({groupname : msg.groupname},function(err,result){
			if(err){
				res.code = "500";
				res.value = "Error while connecting!";
			}else{
				if(result.n>0){
					res.code="200";
					res.value="Document removed";
				}else{
					res.code="304";
					res.value="Error in removing!";
				}
			}
			callback(null,res);
		});
	});
}

function addMember(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection("groups");
		coll.insert({groupname : msg.groupname,member : msg.username,status : 1,timestamp : new Date()},function(err,result){
			if(result.insertedCount>0){
				console.log("result.insertedCount in addMember : " + result.insertedCount);
				console.log("Document Inserted");
				res.code = "200";
				res.value = "Document Inserted";	
			}else{
				res.code="500";
				res.value = "Error while inserting document!";
			}
			callback(null,res);
		});
	});
}

function addGroup(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll=mongo.collection("groups");
		coll.insert({groupname : msg.groupname,created_by : msg.username,member : msg.username,status : 2,timestamp : new Date()},function(err,result){
			if(result.insertedCount>0){
				console.log("result.insertedCount in addGroup : " + result.insertedCount);
				console.log("Document Inserted");
				res.code = "200";
				res.value = "Document Inserted";	
			}else{
				res.code="500";
				res.value = "Error while inserting document!";
			}
			callback(null,res);
		});
	});
}