'use strict';

describe('Directive: scrollOnChange', function () {

  // load the directive's module
  beforeEach(module('wikiQuestApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<scroll-on-change></scroll-on-change>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the scrollOnChange directive');
  }));
});