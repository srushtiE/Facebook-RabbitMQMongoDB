/**
 * Controller for profile.html template
 */

myFacebook.controller('ProfileController',function($scope,$rootScope,dataService,$location,$window){
	
	// initializing function
	$scope.initFunction = function(){
		$rootScope.userName = $window.localStorage.userName;
		getPosts();
		$scope.newPost="";
		getGroupsList();
	};
	
	// function to get the list of groups
	function getGroupsList (){
		var url = 'showGroupList/'+$rootScope.userName;
		$scope.groups=[];
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				for(var i=0;i<res.data.length;i++){
					$scope.groups[i] = res.data[i]; 
				}
			}
		});
	}
	
	// function to get the groups.html template
	$scope.getTemplate=function(groupName){
		$window.localStorage.groupName = groupName;
		$rootScope.groupName = groupName;
		$scope.templateView.template='templates/groups.html';
	};
	
	// function to post the newsfeeds
	$scope.postNew=function(){
		if($scope.newPost){
			var feedDetails={
					userName: $rootScope.userName,
					newsFeed: $scope.newPost
			};
			dataService.postData('postNewsFeeds',feedDetails,function(err,res){
				if(err){
					console.log(err);
				}else{
					$scope.initFunction();
				}
			});
		}
	};
	
	// function to get all the news feeds
	function getPosts(){
		var url ="getNewsFeeds/"+$rootScope.userName;
		$scope.newfeedDetails=[];
		dataService.getData(url,function(err,res){
			if(err){
				console.log(err);
			}else{
				var temp=[];
				console.log("in controller getPosts : "+JSON.stringify(res.data));
				var data1=res.data;
				for(var i=0;i<data1.length;i++){
					temp[i]=data1[i].list;
				}
				$scope.newfeedDetails = temp;
			}
		});
	}

});