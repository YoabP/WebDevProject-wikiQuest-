'use strict';

angular.module('wikiQuestApp')
  .controller('MatchMakingCtrl', ['$scope', '$http', '$timeout', '$location', '$notification', 'socket',
   function ($scope, $http, $timeout, $location, $notification, socket) {

//important code
//request permission for notification
$notification.requestPermission();
    //variables
    $scope.matches = [];
    $scope.alias = '';
    $scope.status = {};
    $scope.currentMatch = {};
    $scope.hosting = false;
    $scope.activeAlias = '';
    //private variables


    //fetch matches
    $http.get('api/matches').then(function(response){
      $scope.matches = response.data;
      socket.syncUpdates('match', $scope.matches);
    });
    // listeners for changes
    socket.socket.on('match:save', function (item) {
      if(item._id === $scope.currentMatch._id){ //update cMatch
        $scope.currentMatch = item;
        if($scope.currentMatch.started){
          //notiffy
          $notification('WikiQuest', {
            body: 'Match Started!',
            dir: 'auto',
            lang: 'en',
            delay: 2000, // in ms
            focusWindowOnClick: true // focus the window on click
          });
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

    //Remove listeners
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('match');
    });

    //Functions
    //Match create
    $scope.createMatch = function() {
      swal({
         title: "Create a new match?",
         text: "Users will be able to join your match.\nThey'll be notified when you click start.",
         type: "input",
         inputPlaceholder: "Type an alias",
         showCancelButton: true,
         confirmButtonText: "Create it!",
         closeOnConfirm: false
       },
       function(inputValue){
         if (inputValue === false) return false;
         if (inputValue === "") {
           swal.showInputError("You need an alias to host!");
           return false;
         }
         //Join the Match
         createMatch(inputValue);
         swal("Match created!", "Hosting as " + inputValue, "success");
       });
    };
    function createMatch(alias) {
      $http.post('/api/matches', {
        creator: alias,
        started: false,
        ended: false
      }).then(function(response){
        changeMatch(response.data);
        $scope.hosting = true;
        $scope.activeAlias = alias;
      });
    }
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
      $http.put('/api/matches/' +$scope.currentMatch._id, $scope.currentMatch);
    };
    //Match cancel
    $scope.cancelMatch = function (){
      swal({
         title: "Cancel match?",
         text: $scope.hosting? "Match will be deleted." : "You'll exit the match.",
         type: "warning",
         showCancelButton: true,
         confirmButtonText: "Yes, I'm out!",
         confirmButtonColor: "#DD6B55",
         closeOnConfirm: false
       },
       function(){
         cancelMatch();
         swal("You're out!", "Ran away from match.", "error");
       });
     };
    function cancelMatch(){
      changeMatch({});
    }
    //start a Match
    $scope.startMatch = function (solo) {
      //send to other URL and send the currentMatchKey
      //window.location.href = 'game.html?match=solo&username=loner';
      $http.put('/api/matches/' +$scope.currentMatch._id, {started: true});
    }
    $scope.pushMsg = function (){
      if ($scope.currentMatch._id){
        $scope.currentMatch.messages.push({alias:$scope.activeAlias, msg: $scope.newMsg});
        $http.put('/api/matches/' +$scope.currentMatch._id, $scope.currentMatch);
        $scope.newMsg = '';
      }
    };
    //private functions
    function matchCanceled(){
      //match got removed by someone,
      //it no longer exits in DB, so no cleaning needed
      swal("You're out!", "Match cancelled by host.", "error");
      $scope.currentMatch = {};
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
              $http.put('/api/matches/' +$scope.currentMatch._id, $scope.currentMatch);
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
  }]);
