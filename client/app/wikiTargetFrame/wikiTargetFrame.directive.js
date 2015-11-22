'use strict';

angular.module('wikiQuestApp')
  .directive('wikiTargetFrame', ['$compile', function ($compile) {
    return {
      templateUrl: 'app/wikiTargetFrame/wikiTargetFrame.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.$watch(attrs.extract, function(value) {
          if(value){
              element.find('h1').html(value.title);
              element.find('p').html(value.extract);
              if(value.thumbnail){
                element.find('img').attr('ng-src',
                  value.thumbnail.source.replace(/(.*\/)thumb\/(.*)\/.*/,"$1$2"))
                  .show();
              }
              else {
                element.find('img').hide();
              }
              $compile(element.contents())(scope);
            }
          });
      }
    };
  }]);
