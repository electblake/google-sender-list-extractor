'use strict';

describe('Controller: EmailsSetupCtrl', function () {

  // load the controller's module
  beforeEach(module('addressBundlerApp'));

  var EmailsSetupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailsSetupCtrl = $controller('EmailsSetupCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
