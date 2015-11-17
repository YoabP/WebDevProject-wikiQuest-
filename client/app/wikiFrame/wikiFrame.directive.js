'use strict';

angular.module('wikiQuestApp')
.directive('wikiFrame', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          return scope.$eval(attrs.wikiFrame);
        },
        function(value) {
          element.html(value);
          $compile(element.contents())(scope);
        }
      )};
    }]);
