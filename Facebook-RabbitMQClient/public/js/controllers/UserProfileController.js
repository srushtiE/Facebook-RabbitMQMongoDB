/**
 * Controller for userProfile.html template
 * which handles searched user's details
 */
myFacebook.controller('UserProfileController',function($scope,$rootScope,dataService,$location,$window){
	
	// initializing function
	$scope.initFunction = function(){
		$scope.searchedUserName=$window.localStorage.searchedUserName;
		$scope.overview = ["Overview","Work and Education","Places You've Lived","Contact and Basic Info","Life Events"];
		getFriendsList();
		$scope.getOverviewDetails("Overview");
		$scope.tabActive('about');
		// service call to check the status of the friend request sent
		dataService.getData('checkFriendRequest/'+$rootScope.userName+'/'+$scope.searchedUserName,function(err,res){
			if(err){
				console.log(err);
			}else{
				console.log("res.data in checkFriendRequest: "+JSON.stringify(res.data));
				var data1;
				if(res.data){
					data1 = res.data;
				}
				if(!res.data)
					$scope.isFriend="no";
				else if(data1[0].list.username==$rootScope.userName && data1[0].list.status==1)
					$scope.isFriend="pendingByUser";
				else if(data1[0].list.username==$scope.searchedUserName && data1[0].list.status==1)
					$scope.isFriend="pending";
				else if(data1[0].list.status==2)
					$scope.isFriend="yes";
			}
		});
	};
	
	// function to send friend request to the user searched
	$scope.sendFriendRequest=function(){
		var requestDetails={
				userName : $rootScope.userName,
				toUser : $scope.searchedUserName
		};
		dataService.postData('addFriend',requestDetails,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.isFriend="pendingByUser";
			}
		});
	};
	
	// function to accept the friend request of the searched user
	$scope.acceptFriendRequest=function(){
		var requestDetails={
				withUser : $scope.searchedUserName,
				userName : $rootScope.userName
		};
		dataService.postData('confirmFriend',requestDetails,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.isFriend="yes";
				getFriendsList();
			}
		});
	};

	// function to get the friend list of the searched user
	function getFriendsList(){
		$scope.friendsFName = [];
		$scope.friendsLName = [];
		$scope.friendsUserSearch=[];
		var fullName = "";
		var url = 'getFriendList/'+ $scope.searchedUserName;
		dataService.getData(url,function(err,res){
			console.log("inside HomeCtrl dataservice friends list");
			if(err){
				console.log(err);
			}else{
				/*for(var i=0;i<res.data.length;i++){
					$scope.friendsFName = res.data[i].fname;
					$scope.friendsLName = res.data[i].lname;
					fullName = res.data[i].fname+" "+res.data[i].lname;
					$scope.friendsUserSearch[i] = fullName;
				}*/
				$scope.friendsUserSearch=res.data;
			}
		});
	}

	// function to get the user's overview details
	$scope.getOverviewDetails=function(ov){
		$scope.overviewDetails =[];
		$rootScope.ovid='0';
		if(((ov).localeCompare("Overview"))==0){
			var url = 'showOverview/'+$scope.searchedUserName;
			dataService.getData(url,function(err,res){
				if(err){
					console.log(err);
				}else{
					console.log("response in the controller : " + JSON.stringify(res.data));
					var data1 = res.data;
					for(var i=0;i<data1.length;i++){
						console.log("info: " + data1[i].list.info);
						console.log("ovid: " + data1[i].list.ovid);
						$scope.overviewDetails[i] = data1[i].list;
					}
					console.log("info line 78: "+res.data[0].list.info);
				}
			});
		}else{
			switch(ov){
			case "Work and Education" : 
				var url ='showOverviewDetails/'+$scope.searchedUserName+'/1';
				dataService.getData(url,function(err,res){
					if(err){
						console.log(err);
					}else{
						console.log("response in the controller : " + res.data);
						var data2 = res.data;
						for(var i=0;i<data2.length;i++){
							console.log("info: " + data2[i].list.info);
							console.log("ovid: " + data2[i].list.ovid);
							$scope.overviewDetails[i] = data2[i].list;
						}
					}
				});
				break;
			case "Places You've Lived" :
				var url ='showOverviewDetails/'+$scope.searchedUserName+'/2';
				dataService.getData(url,function(err,res){
					if(err){
						console.log(err);
					}else{
						var data3 = res.data;
						for(var i=0;i<data3.length;i++){
							console.log("info: " + data3[i].list.info);
							console.log("ovid: " + data3[i].list.ovid);
							$scope.overviewDetails[i] = data3[i].list;
						}
					}
				});
				break;
			case "Contact and Basic Info" :
				var url ='showOverviewDetails/'+$scope.searchedUserName+'/3';
				dataService.getData(url,function(err,res){
					if(err){
						console.log(err);
					}else{
						var data4 = res.data;
						for(var i=0;i<data4.length;i++){
							console.log("info: " + data4[i].list.info);
							console.log("ovid: " + data4[i].list.ovid);
							$scope.overviewDetails[i] = data4[i].list;
						}
					}
				});
				break;
			case "Life Events" :
				var url ='showOverviewDetails/'+$scope.searchedUserName+'/4';
				dataService.getData(url,function(err,res){
					if(err){
						console.log(err);
					}else{
						var data5 = res.data;
						for(var i=0;i<data5.length;i++){
							console.log("info: " + data5[i].list.info);
							console.log("ovid: " + data5[i].list.ovid);
							$scope.overviewDetails[i] = data5[i].list;
						}
					}
				});
				break;
			}

		}
	};
	
	// activating tabs for viewing overview, friends or interests of the user searched
	$scope.tabActive=function(tabName){
		switch(tabName){
		case 'about' : 
			$scope.about = true;
			$scope.frnd = false;
			$scope.interests = false;
			break;
		case 'friends' :
			$scope.frnd = true;
			$scope.about = false;
			$scope.interests = false;
			break;
		case 'interests' :
			$scope.interests = true;
			// function to get the searched user's interests
			dataService.getData('getUserInterests/'+$scope.searchedUserName,function(err,res){
				if(err){
					console.log(err);
				}else{
					var temp=[];
					console.log("in controller : "+JSON.stringify(res.data));
					var data1=res.data;
					for(var i=0;i<data1.length;i++){
						temp[i]=data1[i].list;
					}
					console.log("list in controller: "+ JSON.stringify(temp));

					$scope.userSearchMusicInterest = temp.filter(function(obj){
						return obj.category==="Music";
					});
					$scope.userSearchShowsInterest = temp.filter(function(obj){
						return obj.category==="Shows";
					});
					$scope.userSearchSportsInterest = temp.filter(function(obj){
						return obj.category==="Sports";
					});
				}
			});
			$scope.frnd = false;
			$scope.about = false;
			break;
		}
	};
});