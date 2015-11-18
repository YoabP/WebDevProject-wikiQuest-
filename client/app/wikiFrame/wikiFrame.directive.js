'use strict';

angular.module('wikiQuestApp')
  .directive('wikiFrame', ['$compile', function ($compile) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.$watch(attrs.page, function(value) {
            element.html(value);
            $compile(element.contents())(scope);
          });
      }
    };
  }]);
