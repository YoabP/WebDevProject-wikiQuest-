'use strict';

angular.module('wikiQuestApp')
  .controller('GameCtrl', ['$scope','$sce','wikiApi','wikiParserFilter',
  function($scope, $sce, wikiApi, wikiParserFilter) {
    //tesst code, expendable
    wikiApi.getRandomArticle().then(function(data) {
      $scope.data = data;
      //wikiApi.getFull("UK").then(function(data) {
      wikiApi.getFullRedirectSafe($scope.data.title).then(function(data) {
        var parsed = wikiParserFilter(data.parse.text['*']);
        //$scope.pageFullHTML = $sce.trustAsHtml(parsed);
        $scope.pageFullHTML = parsed;
      });
    });
    wikiApi.getRandomArticle().then(function(data) {
      $scope.data2 = data;
      /*wikiApi.getExtract(data.title).then(function(data) {
        console.log("extract");
        console.log(data);
      });*/
    });


    //Important code
    $scope.innerLink = function innerLink (title){
      console.log(wikiApi.getFullRedirectSafe());
      wikiApi.getFullRedirectSafe(title).then(function(data) {
        //$scope.pageFullHTML = $sce.trustAsHtml(wikiParserFilter(data.parse.text['*']));
        $scope.pageFullHTML = wikiParserFilter(data.parse.text['*']);
      });
    };
  }]);
