'use strict';

describe('Filter: wikiParser', function () {

  // load the filter's module
  beforeEach(module('wikiQuestApp'));

  // initialize a new instance of the filter before each test
  var wikiParser;
  beforeEach(inject(function ($filter) {
    wikiParser = $filter('wikiParser');
  }));

  it('should return the input prefixed with "wikiParser filter:"', function () {
    var text = 'angularjs';
    expect(wikiParser(text)).toBe('wikiParser filter: ' + text);
  });

});
