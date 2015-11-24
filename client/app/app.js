'use strict';

angular.module('wikiQuestApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  'ngAnimate',
  'notification'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/matchMaking'
      });

    $locationProvider.html5Mode(true);
  });
