'use strict';

angular.module('wikiQuestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/matchMaking', {
        templateUrl: 'app/matchMaking/matchMaking.html',
        controller: 'MatchMakingCtrl'
      });
  });
