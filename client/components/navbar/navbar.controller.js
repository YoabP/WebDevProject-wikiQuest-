'use strict';

angular.module('wikiQuestApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
      {
        'title': 'Match Making',
        'link': '/matchMaking'
      },
      {
        'title': 'Game',
        'link': '/game'
      }
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
