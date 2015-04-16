'use strict';

describe('Controller: EmailsBundleCtrl', function () {

  // load the controller's module
  beforeEach(module('addressBundlerApp'));

  var EmailsBundleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailsBundleCtrl = $controller('EmailsBundleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
