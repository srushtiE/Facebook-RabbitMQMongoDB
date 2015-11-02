/**
 * Controller for log in form in addUser.ejs
 */
'use strict';
myFacebook.controller('GetUserController',function($scope,$rootScope,dataService,$location,$window){
	
	// function to log the user in to the system
	$scope.getUser=function(){
		var userDetails = {
				userName : $scope.uName,
				password : $scope.pswd
		};
		console.log("Inside GetUserController");
		// calling the post service to get the details
		dataService.postData('logIn',userDetails,function(err,res){
			if(err){
				if(err.status === 500){
					console.log(err);
				}else{
					if(err.status === 403){
						$scope.invalidError=true;
					}
				}
			}else{
				$rootScope.userName = $scope.uName;
				$rootScope.userFName = res.data.fname;
				$window.localStorage.userFName = res.data.fname;
				$window.localStorage.userName = $scope.uName;
				$location.path('/home');
			}
		});
	};

	$scope.closeError=function(){
		$scope.uName="";
		$scope.pswd="";
	};
});