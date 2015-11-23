'use strict';

angular.module('wikiQuestApp')
  .controller('GameCtrl', ['$scope','$anchorScroll','$location','$http','wikiApi','wikiParserFilter','socket',
  function($scope, $anchorScroll, $location, $http, wikiApi, wikiParserFilter, socket) {
    //tesst code, expendable

    ///////////////////////////////////////////////
    //Important code                            //
    //////////////////////////////////////////////
    //get and clean parameters
    var params = $location.search();
    $scope.alias = params.alias?params.alias : 'Loner' ;
    var matchId = params.match?params.match: 'solo' ;
    console.log({alias:$scope.alias, match:matchId });
    $location.search('alias',null);
    $location.search('match',null);
    //variables
    var jumpBacks= 0;
    $scope.history=[];
    //setup listeners
    socket.socket.on('match:save', function (item) {
      if(item._id === matchId){ //update cMatch
        if(item.winner.name){
          var winAlert = 'Winner: '+item.winner.name+'\n'+'Quest:'+item.winner.start+' >> '
						+item.winner.end+'\n'+'Returns: '+item.winner.backs+'\n\n'+'Path:\n';
					item.winner.pages.forEach(function(element,index) {
						winAlert+=index+': ' + element+'\n'
					});
          alert(winAlert);
          $http.delete('/api/matches/' + matchId);
          $location.url('/matchMaking');
        }
      }
    });
    //fetch start and end articles
    wikiApi.getRandomArticle().then(function(data) {
      $scope.start = data.title;
      $scope.history.push(data.title.replace(/_/g," "));
      wikiApi.getFullRedirectSafe($scope.start).then(function(data) {
        console.log(data);
        $scope.pageFullHTML = wikiParserFilter(data.parse.text['*'], $scope.start );
      });
    });
    wikiApi.getRandomArticle().then(function(data) {
      $scope.end = data.title;
      wikiApi.getExtract($scope.end, data.id).then(function(data) {
        console.log(data);
        $scope.target = data;
      });
    });
    //anchor links inside content
    $scope.anchor = function(id) {
        console.log(id);
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
      console.log(jumpBacks);
  	}
    //private Functions
    function handleWin(){
  		if(matchId != 'solo'){
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
        $http.put('/api/matches/' + matchId, winner)
        .then( function (response){console.log(response);});
  		}
  		else{
  			alert("You won, but of course you were alone.")
  			$location.url('/matchMaking');
  		}
  	}

  }]);
