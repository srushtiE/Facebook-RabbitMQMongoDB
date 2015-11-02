/**
 * handles HTTP service requests
 */
myFacebook.service('dataService',function($http){
	
	// get service handler
	this.getData = function(URI,callback){
		console.log("Inside dataService");
		return $http({
			method : 'GET',
			url : "/api/" + URI
		}).success(function(res){
			console.log("Inside dataService Success");
			// callback with response object
			callback(null,res);
		}).error(function(err){
			console.log("Inside dataService Error");
			// callback with error object
			callback(err);
		});
	};
	
	// post service handler
	this.postData = function(URI,details,callback){
		return $http({
			method : 'POST',
			url : "/api/" +URI,
			data : details
		}).success(function(res){
			// callback with response object
			callback(null,res);
		}).error(function(err){
			// callback with error object
			callback(err);
		});
	};
});