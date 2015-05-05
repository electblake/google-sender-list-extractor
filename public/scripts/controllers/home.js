'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:HomCtrl
 * @description
 * # HomCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('HomeCtrl', ['$scope', '$log', '$rootScope', function ($scope, $log, $rootScope) {

  	$rootScope.PageMeta.title = 'Capture Incoming Email Addresses from Google';
   	$scope.pageview();
  }]);