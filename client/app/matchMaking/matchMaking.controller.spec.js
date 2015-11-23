'use strict';

describe('Controller: MatchMakingCtrl', function () {

  // load the controller's module
  beforeEach(module('wikiQuestApp'));

  var MatchMakingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MatchMakingCtrl = $controller('MatchMakingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
