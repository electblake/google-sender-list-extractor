'use strict';

describe('Controller: EmailsAbstractCtrl', function () {

  // load the controller's module
  beforeEach(module('addressBundlerApp'));

  var EmailsAbstractCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailsAbstractCtrl = $controller('EmailsAbstractCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
