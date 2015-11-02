/**
 * Newsfeeds related API's
 */

var ejs = require("ejs");
var mq_client = require('../rpc/client');


// post new news feeds
exports.postNewsFeeds=function(req,res){
	var msg_payload={
			operation : "post",
			message : {
				username : req.body.userName,
				newsfeed : req.body.newsFeed
			}
	};
	mq_client.make_request('newsfeeds_queue',msg_payload,function(err,results){
		console.log(results);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in newsfeeds.js post");
			res.status(200).json({
				message : "success"
			});
		} 
	});
};

// get news feeds
exports.getNewsFeeds=function(req,res){
	
	var msg_payload={
			operation : "get",
			message : {
				username : req.params.userName
			}
	};
	mq_client.make_request('newsfeeds_queue',msg_payload,function(err,results){
		console.log(results.data);
		if(err){
			res.status(500).json({
				message : "Error!"
			});
		}else{
			console.log("Success in newsfeeds.js getNewsFeeds line 45: "+ JSON.stringify(results.data));
			res.status(200).json({
				message : "success",
				data : results.data
			});
		}
	});
};