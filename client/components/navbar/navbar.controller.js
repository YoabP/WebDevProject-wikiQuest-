'use strict';

angular.module('wikiQuestApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
      {
        'title': 'Home',
        'link': '/'
      },
      {
        'title': 'Game',
        'link': '/game'
      },
      {
        'title': 'Match Making',
        'link': '/matchMaking'
      }
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
