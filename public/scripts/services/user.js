'use strict';

/**
 * @ngdoc service
 * @name addressBundlerApp.User
 * @description
 * # User
 * Service in the addressBundlerApp.
 */
angular.module('addressBundlerServices')
	.run(['DS', function(DS) {
		// console.log('asdf');
		DS.defineResource('user', {
			idAttribute: '_id'
		});
	}]);