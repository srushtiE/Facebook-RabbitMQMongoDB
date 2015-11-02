/**
 * New node file
 */
var mongo = require("../helper/mongo");
var mongoURL = "mongodb://localhost:27017/fbdb";

exports.redirect_operation=function(req,callback){
	var operation = req.operation;
	var message = req.message;

	switch(operation){
	case "get":
		getNewsFeeds(message,callback);
		break;
	case "post":
		postNewsFeeds(message,callback);
		break;
	default :
		callback({status : 400,message : "Invalid Request"});
	}
};

function postNewsFeeds(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("newsfeeds");
		coll.insert({username: msg.username, feed : msg.newsfeed, timestamp : new Date()}, function(err,result){
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

function getNewsFeeds(msg,callback){
	var res={};
	mongo.connect(mongoURL,function(){
		var coll = mongo.collection("newsfeeds");
		var coll1 = mongo.collection("friends");
		coll1.find({$or:[{user_one:msg.username,status : 2},{user_two:msg.username,status:2}]},{_id:0,user_one:1,user_two:1}).toArray(function(err,result){
			if(err){
				res.data = "Error Occurred!";
				console.log("Error");
			}else{
				console.log("results line 58 : "+ JSON.stringify(result, null, 4));
				var temp=[];
				for(var i=0;i<result.length;i++){
					temp.push(result[i].user_one);
					temp.push(result[i].user_two);
				}
				console.log("temp arr : "+ temp[0] + temp[1]);
				coll.find({username:{$in: temp}}).sort({timestamp:-1}).toArray(function(err,result){
					if(err){
						console.log(err);
					}else{
						console.log("value of result in getNewsFeeds line 68: "+JSON.stringify(result,null,4));
						res.value = "Success";
						var feedList=[];
						for(var i=0;i<result.length;i++){
							feedList.push({
								"list" :{
									"feed":result[i].feed,
									"userid":result[i].username,
									"timestamp":result[i].timestamp
								}
							});
						}
						res.data = feedList;
					}
					callback(null,res);
				});
			}
			//callback(null,res);
		});
	});
}