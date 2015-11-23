'use strict';

angular.module('wikiQuestApp')
	.controller('MatchMakingCtrl', ['$scope', '$http', '$timeout', '$location', '$notification', 'socket',
	 function ($scope, $http, $timeout, $location, $notification, socket) {

//important code
		//variables
		$scope.matches = [];
		$scope.alias = '';
		$scope.status = {};
		$scope.alerts =[];
		$scope.currentMatch = {};
		$scope.hosting = false;
		$scope.activeAlias = '';
		//private variables


		//fetch matches
		$http.get('api/matches').then(function(response){
			$scope.matches = response.data;
			socket.syncUpdates('match', $scope.matches);
			console.log(response.data);
		});
		// listeners for changes
		socket.socket.on('match:save', function (item) {
			if(item._id === $scope.currentMatch._id){ //update cMatch
				$scope.currentMatch = item;
				if($scope.currentMatch.started){
					swal({
						title: "Match Started!",
						text: "Quick get to it!",
						type: "warning",
						showCancelButton: true,
						confirmButtonText: "Bring it!",
						closeOnConfirm: false,
            closeOnCancel: false
					},
					function(isConfirm){
            if (isConfirm) {
              matchStarted();
              swal.close();
              $scope.$apply(); //fix for non Angular Callback
            }
            else{
              cancelAtStart();
              swal("Cancelled", "You ran away from the match.", "error");
            }
					});
				}
			}
		});
		socket.socket.on('match:remove', function (item) {
			if(item._id === $scope.currentMatch._id){ // cMatch died
				matchCanceled();
			}
		});

		//Remove sync
		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('match');
		});
		$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};


		//Functions
		//Match create
		$scope.createMatch = function() {
			if($scope.alias === '') {
				alert("need alias");
				return;
			}
			$http.post('/api/matches', {
				creator: $scope.alias,
				started: false,
				ended: false
			}).then(function(response){
				//TODO: indicate match was created succes mssg
				changeMatch(response.data);
				$scope.hosting = true;
				$scope.activeAlias = $scope.alias;
				createAlert("success", "Match Created", 2000);
			});
		};
		//Match join

		$scope.joinMatch = function(newMatch) {
			swal({
				 title: "Join "+newMatch.creator +"'s match?",
				 text: "You will be notified when "+newMatch.creator +" starts the match.",
				 type: "input",
				 inputPlaceholder: "Type an alias",
				 showCancelButton: true,
				 confirmButtonText: "Yes, I'm in!",
				 closeOnConfirm: false
			 },
			 function(inputValue){
				 if (inputValue === false) return false;
				 if (inputValue === "") {
					 swal.showInputError("You need an alias to join!");
					 return false;
				 }
				 //Join the Match
				 joinMatch(newMatch, inputValue);
				 swal("You're in!", "Joined as " + inputValue, "success");
			 });
		};
		function joinMatch (newMatch, alias) {
			changeMatch(newMatch);
			//add yourself to guest list
			$scope.activeAlias= alias;
			$scope.currentMatch.guests.push($scope.activeAlias);
			$http.put('/api/matches/' +$scope.currentMatch._id, $scope.currentMatch)
			.then( function (response){console.log(response);});
		};
		//Match cancel
		$scope.cancelMatch = function (){
			changeMatch({});
			$scope.status.msg = "Match Canceled";
			$scope.status.style= "bg-danger text-danger";
		}
		//start a Match
		$scope.startMatch = function (solo) {
			//send to other URL and send the currentMatchKey
			//window.location.href = 'game.html?match=solo&username=loner';
			$http.put('/api/matches/' +$scope.currentMatch._id, {started: true})
			.then( function (response){console.log(response);});
		}
		//private functions
		function matchCanceled(){
			//match got removed by someone,
			//it no longer exits in DB, so no cleaning needed
			$scope.currentMatch = {};
			$scope.status.msg = "Match Canceled by Host";
			$scope.status.style= "bg-danger text-danger";
		}
		function changeMatch(newMatch){
				//Check if match was set
				if($scope.currentMatch._id){ //Clean old match data
						if($scope.hosting){ //remove match alltogether
								$http.delete('/api/matches/' +$scope.currentMatch._id);
						}
						else{ //remove from guest list
							var index = $scope.currentMatch.guests.indexOf($scope.activeAlias);
							if (index != -1){
								$scope.currentMatch.guests.splice(index,1)
							}
							$http.put('/api/matches/' +$scope.currentMatch._id, $scope.currentMatch)
							.then( function (response){console.log(response);});
						}
				}
				//Apply new match
				$scope.currentMatch = newMatch;
				$scope.hosting=false;
			}
			function matchStarted(){
				$location.url('/game?alias='+$scope.activeAlias+'&match='+$scope.currentMatch._id);
			}
      function cancelAtStart(){
        $scope.hosting = false; //Lose hosting rights over match, avoid deletion.
        changeMatch({});
      }
			//create alert
			function createAlert(type, msg, time){
				var index = $scope.alerts.length;
				$timeout(function() {
					$scope.closeAlert(index);
				}, time);
				$scope.alerts.push({type: type, msg: msg});
			}
	}]);
