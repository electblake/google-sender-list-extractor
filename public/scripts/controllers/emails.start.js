'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsStartCtrl
 * @description
 * # EmailsStartCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsStartCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
  	$rootScope.$evalAsync(function() {
  		$rootScope.PageMeta.title = 'Getting Started';
  	});
    $scope.pageview();
  }]);
