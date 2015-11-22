'use strict';

angular.module('wikiQuestApp')
  .controller('GameCtrl', ['$scope','$sce','wikiApi','wikiParserFilter',
  function($scope, $sce, wikiApi, wikiParserFilter) {
    //tesst code, expendable
    $scope.test= function(){wikiApi.getRandomArticle().then(function(data) {
      $scope.end = data.title;
      wikiApi.getExtract($scope.end, data.id).then(function(data) {
        console.log(data);
        $scope.target = data;
      });
    });
  };
    ///////////////////////////////////////////////
    //Important code                            //
    //////////////////////////////////////////////
    $scope.history=[];
    //fetch start and end articles
    wikiApi.getRandomArticle().then(function(data) {
      $scope.start = data.title;
      $scope.history.push(data.title);
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
      console.log(wikiApi.getFullRedirectSafe());
      wikiApi.getFullRedirectSafe(title).then(function(data) {
        //$scope.pageFullHTML = $sce.trustAsHtml(wikiParserFilter(data.parse.text['*']));
        $scope.history.push(title);
        $scope.pageFullHTML = wikiParserFilter(data.parse.text['*'], title);
      });
    };
  }]);
