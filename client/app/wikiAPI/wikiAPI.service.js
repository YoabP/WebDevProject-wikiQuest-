'use strict';

angular.module('wikiQuestApp')
.factory('wikiApi', ['$http', function wikiRandomPage ($http){
  return {
    getRandomArticle: function getRandomPageData(wikipediaPage){
      return $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json&callback=JSON_CALLBACK").
      then(function (response){
          var pid;
          var ptitle;
          for (var page in response.data.query.pages) {
            pid= page;
            ptitle = response.data.query.pages[page].title;
            break;
          }
          return { id: pid , title: ptitle};
        });
    },
    getExtract: function getPageExctract (wikipediaPage){
      return $http.jsonp("http://en.wikipedia.org/w/api.php?action=query&format=json&exintro&callback=JSON_CALLBACK",
        {params: {
          titles:wikipediaPage,
          prop:'extracts|pageimages',
          uselang:'en'
        }})
      .then(function (response){
            return response.data;
        });
    },
    getFull: function getFullPage(wikipediaPage){
      return $http.jsonp("http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=JSON_CALLBACK",
        {params: {
          page:wikipediaPage,
          prop:'text|images',
          uselang:'en'
        }})
      .then(function (response){
          return response.data;
        });
    },
    getFullRedirectSafe: function getRedirectSafe(wikipediaPage){
      return $http.jsonp("http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=JSON_CALLBACK",
        {params: {
          page:wikipediaPage,
          prop:'text|images',
          uselang:'en'
        }})
      .then(function (response){
          //Handle redirects
          var tempdiv = document.createElement('div');
          tempdiv.innerHTML = response.data.parse.text['*'];
          var redirect = tempdiv.querySelector('.redirectText a');
          if (redirect){
            return getRedirectSafe(redirect.textContent);
          }
          return response.data;
        });
    }
  };
}]);
