'use strict';

angular.module('wikiQuestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/game', {
        templateUrl: 'app/game/game.html',
        controller: 'GameCtrl',
        reloadOnSearch: false
      });
  });
