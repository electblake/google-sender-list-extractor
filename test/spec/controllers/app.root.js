'use strict';

describe('Controller: AppRootCtrl', function () {

  // load the controller's module
  beforeEach(module('addressBundlerApp'));

  var AppRootCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppRootCtrl = $controller('AppRootCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
