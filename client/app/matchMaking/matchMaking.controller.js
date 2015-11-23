'use strict';

angular.module('wikiQuestApp')
  .controller('MatchMakingCtrl', function ($scope, $http, $timeout, socket) {

//important code
    //variables
    $scope.matches = [];
    $scope.alias = '';
    $scope.status = {}; //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }
    $scope.alerts =[];
    $scope.currentMatch = {};
    $scope.hosting = false;
    //private variables
    var activeAlias = '';

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
        createAlert("success", "Match Created", 3000);
        $scope.status.msg = "Match Created";
        $scope.status.style= "bg-success text-success";
      });
    };
    //Match join
    $scope.joinMatch = function(newMatch) {
      if($scope.alias === '') {
        //TODO: indicate alias is needed
        alert("need alias");
        return;
      }
      changeMatch(newMatch);
      //add yourself to guest list
      activeAlias= $scope.alias;
      $scope.currentMatch.guests.push(activeAlias);
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
    function startMatch(solo){
    	//send to other URL and send the currentMatchKey
        if(solo){
            window.location.href = 'game.html?match=solo&username=loner';
        }
        else{
            currentMatchRef.child('started').set(true);
        }
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
              var index = $scope.currentMatch.guests.indexOf(activeAlias);
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
      //create alert
      function createAlert(type, msg, time){
        var index = $scope.alerts.length;
        $timeout(function() {
          $scope.closeAlert(index);
        }, time);
        $scope.alerts.push({type: type, msg: msg});

      }
  });
