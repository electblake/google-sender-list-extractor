'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:AppRootCtrl
 * @description
 * # AppRootCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('AppRootCtrl', ['$scope', '$http', '$log', '$rootScope', '$q', 'DS', function ($scope, $http, $log, $rootScope, $q, DS) {

	  	var loginSession = $q.defer();
	  	$rootScope.loginSession = loginSession.promise;

    	$http.get('/auth/session').success(function(result) {
    	    loginSession.resolve(result);
    	}).catch(function(err) {
    		loginSession.reject(err);
    	});

        var isLoggedIn = $q.defer();
        $rootScope.isLoggedIn = isLoggedIn.promise;

    	$rootScope.loginSession.then(function(result) {
    		DS.find('user', result.userId).then(function() {
                DS.bindOne('user', result.userId, $rootScope, 'loggedInUser');
            });
    	});


        $rootScope.pageview = function() {
            ga('send', 'pageview', {
                page: location.pathname + location.search  + location.hash
            });
        };

        $rootScope.gaevent = function(category, action, label, value) {
            ga('send', 'event',
                category ? category : null,
                action ? action : null,
                label ? label : null,
                value ? value : null
            );
        };

  }]);
