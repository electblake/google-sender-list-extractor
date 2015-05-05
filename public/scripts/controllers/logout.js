'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('LogoutCtrl', ['$scope', '$http', '$log', '$rootScope', '$q', '$state', function ($scope, $http, $log, $rootScope, $q, $state) {

        $http.get('/logout').success(function() {
            window.location.href="/";
        });

  }]);
