'use strict';

angular.module('wikiQuestApp')
  .directive('scrollOnChange', function () {
    return {
      restrict: 'A',
      scope:{
        watching: "=scrollOnChange",
        mode: "@mode"
      },
      link: function (scope, element, attrs) {
        scope.$watch('watching', function() {
                if(scope.mode === 'top'){
                  element[0].scrollTop = 0;
                }
                else{
                  element[0].scrollTop = element[0].scrollHeight;
                }
            });
      }
    };
  });
