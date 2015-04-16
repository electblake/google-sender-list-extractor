'use strict';

describe('Controller: EmailsStartCtrl', function () {

  // load the controller's module
  beforeEach(module('addressBundlerApp'));

  var EmailsStartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailsStartCtrl = $controller('EmailsStartCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
