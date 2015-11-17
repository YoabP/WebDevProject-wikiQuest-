'use strict';

angular.module('wikiQuestApp')
  .filter('wikiParser', function() {
    return function(input) {
      input = input || '';
      var out = "";
      var tempContainer = document.createElement('div');
      tempContainer.innerHTML = input;
      //patch a tags
      var links = tempContainer.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
        var element = links[i];
        var oldRef = element.getAttribute('href');
        if(oldRef) {
  				if (oldRef[0]=='#'){
            element.setAttribute('href', oldRef); //preserve anchor
          }
  				else if (oldRef[0]=='/' && oldRef[1]=='w' && oldRef[2]!='/') { //is internal
  					var index = oldRef.lastIndexOf('/');
  					var pageName= decodeURIComponent(oldRef.substring(index+1));
            element.setAttribute('ng-click', 'innerLink("'+pageName.replace(/"/g, '\\"')+'")');
            element.setAttribute('href', '#');
  				}
          else if (oldRef[0]=='/' && oldRef[1]=='w' && oldRef[2]=='/'){
            var pageName = element.textContent;
            element.setAttribute('ng-click', 'innerLink("'+pageName.replace(/"/g, '\\"')+'")');
            element.setAttribute('href', '#');
          }
  				else {
            element.setAttribute('href', '#');
          }
  			}
      }
      //patch img tags
      //pending ...
      out = tempContainer.innerHTML;
      //escape possible angular {{ stuff }}
      return out.replace(/({\s*{[\s\S]*?}\s*})/g,'<span ng-non-bindable>$1</span>');
    };
  });