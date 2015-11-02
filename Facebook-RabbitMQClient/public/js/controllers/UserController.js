/**
 * Controller for user.html template
 */
myFacebook.controller('UserController',function($scope,$rootScope,dataService,$location,$window){

	// initializing function
	$scope.initFunction = function(){
		$rootScope.userName = $window.localStorage.userName;
		$rootScope.userFName = $window.localStorage.userFName;
		$scope.overview = ["Overview","Work and Education","Places You've Lived","Contact and Basic Info","Life Events"];
		$scope.templateView = {
				template : 'templates/user.html'
		};
		getFriendsList();
		getPendingFriendsList();
		$scope.getOverviewDetails("Overview");
		$scope.interest = ["Music","Shows","Sports"];
		$scope.tabActive('about');
		$scope.ovid = '0';
	};

	// function to get the friends list
	function getFriendsList(){
		$scope.friendsFName = [];
		$scope.friendsLName = [];
		$scope.friends=[];
		var fullName = "";
		var url = 'getFriendList/'+ $rootScope.userName;
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				console.log(res.data.length);
				console.log(res);
				
				/*for(var i=0;i<res.data.length;i++){
					$scope.friendsFName = res.data[i].fname;
					$scope.friendsLName = res.data[i].lname;
					fullName = res.data[i].fname+" "+res.data[i].lname;
					$scope.friends[i] = fullName;
				}*/
				$scope.friends=res.data;
			}
		});
	}

	// function to get the pending friend requests
	function getPendingFriendsList(){
		$scope.pendingFriends=[];
		var url = 'getPendingFriendsList/'+ $rootScope.userName;
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				$scope.pendingFriends = res.data;
				console.log("pending friend user_one line no 56 : "+JSON.stringify(res.data));
			}
		});
	}

	// function to get the overview details depending upon the tab selected 
	$scope.getOverviewDetails=function(ov){
		$scope.overviewDetails =[];
		$scope.ovid='0';
		$scope.ov = ov;
		if(((ov).localeCompare("Overview"))==0){
			var url = 'showOverview/'+$rootScope.userName;
			dataService.getData(url,function(err,res){
				if(err){
					console.log(err);
				}else{
					/*if(res.data.length==0){
						$scope.noverview=true;
					}*/
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
				var url ='showOverviewDetails/'+$rootScope.userName+'/1';
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
						$scope.ovid = '1';
					}
				});
				break;
			case "Places You've Lived" :
				var url ='showOverviewDetails/'+$rootScope.userName+'/2';
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
						$scope.ovid = '2';
					}
				});
				break;
			case "Contact and Basic Info" :
				var url ='showOverviewDetails/'+$rootScope.userName+'/3';
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
						$scope.ovid = '3';
					}
				});
				break;
			case "Life Events" :
				var url ='showOverviewDetails/'+$rootScope.userName+'/4';
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
						$scope.ovid = '4';
					}
				});
				break;
			}
		}
	};

	// function to change the modal
	$scope.changeModal = function(ovid){
		if(ovid)
			$scope.ovid = ovid;
	};

	// function to add the overview details from the modal
	$scope.addDetail=function(){
		$scope.addovModal=false;
		if($scope.newDetails){
			var ovdetails={
					ovid : $scope.ovid,
					userName : $rootScope.userName,
					info : $scope.newDetails
			};

			dataService.postData('addOverviewDetails',ovdetails,function(err,res){
				if(err){
					console.log(err);
				}else{
					$scope.newDetails="";
					$scope.getOverviewDetails('Overview');
				}
			});
		}else{
			$scope.addovModal=true;
		}
	};

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
			// getting the user interests in case of tab selected
			dataService.getData('getUserInterests/'+$rootScope.userName,function(err,res){
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

					$scope.userMusicInterest = temp.filter(function(obj){
						return obj.category=="Music";
					});
					$scope.userShowsInterest = temp.filter(function(obj){
						return obj.category=="Shows";
					});
					$scope.userSportsInterest = temp.filter(function(obj){
						return obj.category=="Sports";
					});
				}
			});
			$scope.frnd = false;
			$scope.about = false;
			break;
		}
	};

	// adding music interests
	$scope.addInterestsMusic=function(){
		$scope.addmuModal=false;
		if($scope.newNameMusic && $scope.newLabelMusic){
			var interestMusicDetails={
					category : 'Music',
					name : $scope.newNameMusic,
					label : $scope.newLabelMusic,
					userName : $rootScope.userName
			};

			dataService.postData('addUserInterests',interestMusicDetails,function(err,res){
				if(err){
					console.log(err);
				}else{
					$scope.newNameMusic="";
					$scope.newLabelMusic="";
					$scope.tabActive('interests');
				}
			});
		}else{
			$scope.addmuModal=true;
		}
	};

	// adding shows interests
	$scope.addInterestsShows=function(){
		$scope.addshModal=false;
		if($scope.newNameShows && $scope.newLabelShows){
			var interestShowsDetails={
					category : 'Shows',
					name : $scope.newNameShows,
					label : $scope.newLabelShows,
					userName : $rootScope.userName
			};

			dataService.postData('addUserInterests',interestShowsDetails,function(err,res){
				if(err){
					console.log(err);
				}else{
					$scope.newNameShows="";
					$scope.newLabelShows="";
					$scope.tabActive('interests');
				}
			});
		}else{
			$scope.addshModal=true;
		}
	};

	// adding sports interests
	$scope.addInterestsSports=function(){
		$scope.addspModal=false;
		if($scope.newNameSports && $scope.newLabelSports){
			var interestSportsDetails={
					category : 'Sports',
					name : $scope.newNameSports,
					label : $scope.newLabelSports,
					userName : $rootScope.userName
			};

			dataService.postData('addUserInterests',interestSportsDetails,function(err,res){
				if(err){
					console.log(err);
				}else{
					$scope.newNameSports="";
					$scope.newLabelSports="";
					$scope.tabActive('interests');
				}
			});
		}else{
			$scope.addspModal=true;
		}
	};

	// accepting friend requests
	$scope.acceptFriendRequest=function(pfName){
		console.log("in acceptFriendRequest: " + pfName);
		var requestDetails={
				withUser : pfName,
				userName : $rootScope.userName
		};
		dataService.postData('confirmFriend',requestDetails,function(err,res){
			if(err){
				console.log(err);
			}else{
				console.log("in success confimFriend acceptFriendRequest: " + res.data);
				getFriendsList();
				getPendingFriendsList();
			}
		});
	};



});