'use strict';

describe('Service: wikiAPI', function () {

  // load the service's module
  beforeEach(module('wikiQuestApp'));

  // instantiate service
  var wikiAPI;
  beforeEach(inject(function (_wikiAPI_) {
    wikiAPI = _wikiAPI_;
  }));

  it('should do something', function () {
    expect(!!wikiAPI).toBe(true);
  });

});
