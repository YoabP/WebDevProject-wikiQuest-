'use strict';

angular.module('wikiQuestApp')
  .controller('GameCtrl', ['$scope','$sce','wikiApi','wikiParserFilter',
  function($scope, $sce, wikiApi, wikiParserFilter) {
    //tesst code, expendable
  
    ///////////////////////////////////////////////
    //Important code                            //
    //////////////////////////////////////////////
    //variables
    var jumpBacks= 0;
    $scope.history=[];
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
    //links affecting only wiki-frame
    $scope.innerLink = function innerLink (title){
      wikiApi.getFullRedirectSafe(title).then(function(data) {
        //$scope.pageFullHTML = $sce.trustAsHtml(wikiParserFilter(data.parse.text['*']));
        title= title.replace(/_/g," ");
        $scope.history.push(title);
        $scope.pageFullHTML = wikiParserFilter(data.parse.text['*'], title);
        //check for win condition
        if($scope.end === title){
          alert('lol');
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

  }]);
