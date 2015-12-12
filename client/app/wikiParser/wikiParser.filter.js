'use strict';
function unecesaryLink(match, p1,p2, offset, string) {
  return (p1?('class="'+p1+' new"'):(' class="new"'))+' href';
}
angular.module('wikiQuestApp')
  .filter('wikiParser', function() {
    return function(input, title) {
      input = input || '';
      var out = input;
      //regex parsing Wikipedia:VECTOR
      //filter media Files
      out = out.replace(/href="\/wiki\/(?:File|Special|Template):.*?"/g, unecesaryLink);
      //  filter inner links
      out = out.replace(/href="\/wiki\/(.+?)(?:#.*?|)"/g, function (match, p1, offset, string) {
        return 'ng-click="innerLink(\''+decodeURIComponent(p1)
          .replace(/'/g,"\\'")
          .replace(/"/g,'&quot;')
          +'\')" href';
      });
      //Filter wiki links to uneeded tools
      out = out.replace(/(?:class="(.*?)" )?href="\/w\/(.*?)"/g, unecesaryLink);
      out = out.replace(/(?:class="(.*?)" )?href="\/\/(.*?)"/g, unecesaryLink);
      //filter anchors
      out = out.replace(/href="#(.*?)"/g,'href ng-click="anchor(\'$1\')"');
      //filter external links
      out = out.replace(/(?:class="(.*?)" )?href="http.*?"/g, unecesaryLink);
      //filter angular directive confusion
      out = out.replace(/({\s*{[^}{]*?}\s*})/g,'<span ng-non-bindable>$1</span>');
      //append missing title header
      out = '<h1 id="firstHeading" class="firstHeading" lang="en">' +
            title.replace(/_/g,' ') +'</h1>' + out;
      return out;
    };
  });
