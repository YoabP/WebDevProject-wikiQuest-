'use strict';

describe('Directive: wikiFrame', function () {

  // load the directive's module
  beforeEach(module('wikiQuestApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<wiki-frame></wiki-frame>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the wikiFrame directive');
  }));
});