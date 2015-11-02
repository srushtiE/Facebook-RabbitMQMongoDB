/**
 * New node file
 */
var mongo = require("../helper/mongo");
var mongoURL = "mongodb://localhost:27017/fbdb";

exports.redirect_operation=function(req,callback){
	var operation = req.operation;
	var message = req.message;

	switch(operation){
	case "getInterests":
		getInterests(message,callback);
		break;
	case "getUserInterests":
		getUserInterests(message,callback);
		break;
	case "addUserInterests":
		addUserInterests(message,callback);
		break;
	default :
		callback({status : 400,message : "Invalid Request"});
	}
};

function getInterests(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("interest");
		coll.find({category: msg.category}).toArray(function(err,result){
			if(err){
				console.log("Error");
			}else{
				console.log("value of result in getInterests line 34: "+JSON.stringify(result,null,4));
				res.value = "Success";
				var interestList=[];
				for(var i=0;i<result.length;i++){
					interestList.push({
						"list" :{
							"category":result[i].category,
							"name":result[i].name,
							"label":result[i].label,
							"username":result[i].username
						}
					});
				}
				res.data = interestList;
				}
			callback(null,res);
		});
	});
}

function getUserInterests(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("interest");
		coll.find({username: msg.username}).toArray(function(err,result){
			if(err){
				console.log("Error");
			}else{
				console.log("value of result in getUserInterests line 60: "+JSON.stringify(result,null,4));
				res.value = "Success";
				var userinterestList=[];
				for(var i=0;i<result.length;i++){
					userinterestList.push({
						"list" :{
							"category":result[i].category,
							"name":result[i].name,
							"label":result[i].label,
							"username":result[i].username
						}
					});
				}
				res.data = userinterestList;
				}
			callback(null,res);
		});
	});
}

function addUserInterests(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("interest");
		coll.insert({category: msg.category,name: msg.name,label: msg.label,username: msg.username},function(err,result){
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