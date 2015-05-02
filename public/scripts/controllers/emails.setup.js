'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsSetupCtrl
 * @description
 * # EmailsSetupCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsSetupCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {
    $scope.tasks = [];

    $scope.stepPos = 0;

    $scope.tasks.push({
    	name: 'Get Started',
    	progress: '0',
    	message: 'Waiting to Google..',
    	url: '/api/addresses/capture-labels'
    });

    $scope.$evalAsync(function() {
	    $scope.currentTask = $scope.tasks.pop();
    });

    var onceSession = $scope.$watch('loginSession', function(sess, previous) {
        onceSession();
        $scope.loginSession.then(function(result) {
            $scope.stepPos += 1;
        }).catch(function(reason) {
            $scope.currentTask.message = reason.message ? reason.message : reason;
        });
    });

    $scope.$watch('stepPos', function(step, previous) {
        if (step >= 0 && step != previous) {
            console.log('step', step);
            switch(step) {
                case 0:
                default:
                    $scope.authorize();
                case 1:
                    $scope.start();
            }
        }
    });

    $scope.start = function() {

        $http.get('/api/labels/setup').success(function(result) {
            $log.info('result', result);
        }).catch(function(err) {
            $scope.currentTask.message = err.message ? err.message : err;
        });

    };

  }]);