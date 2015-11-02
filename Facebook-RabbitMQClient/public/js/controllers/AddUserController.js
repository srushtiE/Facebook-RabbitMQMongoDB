/**
 * Controller to handle addUser.ejs file
 */
'use strict';
myFacebook.controller('AddUserController',function($scope,$rootScope,dataService,$location,$window){

	/*
	 * called when the user clicks the sign up page
	 */ 
	$scope.addUser=function(){

		//input validation 
		if($scope.signUpForm.fName.$invalid || $scope.signUpForm.lName.$invalid ||
				$scope.signUpForm.userName.$invalid || $scope.signUpForm.reuserName.$invalid ||
				$scope.signUpForm.pwd.$invalid || $scope.signUpForm.month.$invalid || $scope.signUpForm.day.$invalid ||
				$scope.signUpForm.year.$invalid || $scope.signUpForm.gender.$invalid){
			$scope.reqdError=true;
		}else{
			var emailPattern=/.+@.+\..+/i;
			if(!(($scope.userName).match(emailPattern))){
				$scope.usernameInvalid=true;
			}else if((!(($scope.userName).localeCompare($scope.reuserName))== 0)){
				$scope.usernameInvalid=false;
				$scope.emailNoMatch=true;
			}else{
				//proceed if inputs are correct
				var dob = $scope.month+'/'+$scope.day+'/'+$scope.year;
				var userDetails = {
						fName : $scope.fName,
						lName : $scope.lName,
						gender : $scope.gender,
						dob : dob,
						userName : $scope.userName,
						password : $scope.pwd
				};

				//call to the post service to write to the db
				dataService.postData('signUp',userDetails,function(err,res){
					if(err){
						//if error, display appropriate error on GUI
						if(err.status === 500){
							$scope.alreadyExists=true;
						}
					}else{
						//store some values in the root scope and client side storage
						$rootScope.userFName = $scope.fName;
						$rootScope.userLName = $scope.lName;
						$rootScope.userGender = $scope.gender;
						$rootScope.userDob = dob;
						$rootScope.userName = $scope.userName;
						$window.localStorage.userName=$scope.userName;
						$rootScope.userFName=$scope.fName;
						$location.path('/home');
					}
				});
			}

		}
	};
});