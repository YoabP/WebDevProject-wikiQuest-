'use strict';

angular.module('wikiQuestApp')
  .controller('GameCtrl', ['$scope','$anchorScroll','$location','$http','wikiApi','wikiParserFilter','socket',
  function($scope, $anchorScroll, $location, $http, wikiApi, wikiParserFilter, socket) {
    //get and clean parameters
    var params = $location.search();
    $scope.alias = params.alias?params.alias : 'Loner' ;
    var matchId = params.match?params.match: 'solo' ;
    $location.search('alias',null);
    $location.search('match',null);
    //variables
    var jumpBacks= 0;
    var won = false;
    $scope.history=[];
    //setup listeners
    socket.socket.on('match:save', function (item) {
      if(item._id === matchId){ //update cMatch
        if(item.winner.name){
          var winAlert = '<div class = "wq-win-alert"><h4>Quest:&nbsp;<span class="small">'+item.winner.start+' >> '+ item.winner.end +"</span></h4>"
          +'<h4>Returns Used:&nbsp;<span class="small">'+ item.winner.backs +(item.winner.backs==1?' return':' returns')+"</span></h4>"
          +'<h4>Path:</h4><ul>';
					item.winner.pages.forEach(function(element,index) {
						winAlert+='<li>' +index+': ' + element+'</li>';
					});
          winAlert+='</ul></div>';
          swal({
            title: item.winner.name+" won!",
            text: winAlert,
            type: won?"success":"error",
            showCancelButton: false,
            confirmButtonText: won?"Yeah!":"Ok",
            closeOnConfirm: false,
            html: true
          },
          function(){
            if (won){
              $http.delete('/api/matches/' + matchId).then( function (){
                swal.close();
                $location.url('/matchMaking');
              });
            }
            else{
              swal.close();
              $location.url('/matchMaking');
              $scope.$apply();
            }
          });
        }
      }
    });
    //fetch start and end articles
    wikiApi.getRandomArticle().then(function(data) {
      $scope.start = data.title;
      $scope.history.push(data.title.replace(/_/g," "));
      wikiApi.getFullRedirectSafe($scope.start).then(function(data) {
        $scope.pageFullHTML = wikiParserFilter(data.parse.text['*'], $scope.start );
      });
    });
    wikiApi.getRandomArticle().then(function(data) {
      $scope.end = data.title;
      wikiApi.getExtract($scope.end, data.id).then(function(data) {
        $scope.target = data;
      });
    });
    //anchor links inside content
    $scope.anchor = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        $location.hash(old);
    };
    //links affecting only wiki-frame
    $scope.innerLink = function innerLink (title){
      wikiApi.getFullRedirectSafe(title).then(function(data) {
        //$scope.pageFullHTML = $sce.trustAsHtml(wikiParserFilter(data.parse.text['*']));
        title= title.replace(/_/g," ");
        $scope.history.push(title);
        $scope.pageFullHTML = wikiParserFilter(data.parse.text['*'], title);
        //check for win condition
        if($scope.end === title){
          handleWin();
        }
      });
    };
    //handle history population when getting back
    $scope.getBack = function getBackInHistory(title,index){
      var len = $scope.history.length;
      for (var i=index; i<len; i++){
        $scope.history.pop();
      }
  		$scope.innerLink(title);
  		jumpBacks++;
  	}
    //private Functions
    function handleWin(){
  		if(matchId != 'solo'){
        won = true;
        var winner = {
          winner: {
            name: $scope.alias,
    				backs: jumpBacks,
    				start: $scope.start,
    				end: $scope.end,
    				pages: $scope.history
          },
          ended: true
        };
        $http.put('/api/matches/' + matchId, winner);
  		}
  		else{
        swal({
          title: "You won!",
          text: "By yourself though!",
          type: "success",
          showCancelButton: false,
          confirmButtonText: "Yeah!",
          closeOnConfirm: false,
        },
        function(){
          $location.url('/matchMaking');
          swal.close();
          $scope.$apply();
        });
  		}
  	}

  }]);
