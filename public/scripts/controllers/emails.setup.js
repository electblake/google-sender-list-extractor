'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsSetupCtrl
 * @description
 * # EmailsSetupCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsSetupCtrl', ['$scope', '$http', '$log', 'DS', '$timeout', '$rootScope', function ($scope, $http, $log, DS, $timeout, $rootScope) {
    var _ = window._;
    $scope.stepPos = 0;
    $scope.currentTask = {
        name: 'Connect Google',
        message: 'Welcome, please login to continue..',
        progress: 0
    };

    window.jQuery(document).ready(function(){
        window.jQuery('ul.tabs').tabs();
    });

    $scope.filterLabelsExclude = function(row) {
        if (row.use === true) {
            return false;
        }
        return true;
    };

    $scope.stepTab = function($event) {
        var index = $scope.getActiveTabIndex();
        $scope.stepPos = index;
    };

    $scope.getActiveTabIndex = function() {
        var active_index = null;
        _.each(window.jQuery('ul.tabs a'), function(tab, index) {
            if (window.jQuery(tab).hasClass('active')) {
                active_index = index;
            }
        });
        return active_index;
    };

    $scope.getActiveTab = function() {
        var active_index = $scope.getActiveTabIndex();
        return window.jQuery('ul.tabs a')[active_index];
    };

    $scope.activateTab = _.debounce(function(name) {
        // console.log('name', name);
        if (!window.jQuery('ul.tabs a[href="#' + name + '"]').hasClass('active')) {
            window.jQuery('ul.tabs').tabs('select_tab', name);
        }
    }, 500);


    $scope.checkSession = function(cb) {
        if ($scope.loggedInUser && $scope.loggedInUser._id) {
            if (cb) {
                console.log(true);
                cb(null);
            }
        } else {
            console.log(false);
            $scope.$evalAsync(function() {
                $scope.stepPos = 0;
                if (cb) {
                    cb(new Error('Login to Continue!'));
                }
            });
        }
    };

    $scope.$watch('stepPos', function(step, previous) {
        if (step || step === 0) {
            switch(step) {
                case 0:
                    $scope.activateTab('tab-authorize');
                    $scope.currentTask.name = 'Login with Google';
                    $scope.currentTask.message = '';
                    $scope.authorize();
                    break;
                case 1:
                    $scope.activateTab('tab-select-labels');
                    $scope.currentTask.name = 'Select Labels';
                    $scope.currentTask.message = 'Select message threads from specified labels';
                    $scope.checkSession(function(err) {
                        if (!err) {
                            $scope.start();
                        }
                    });
                    break;
                case 2:
                    $scope.activateTab('tab-capture');
                    $scope.currentTask.name = 'Capture Addresses';
                    $scope.currentTask.message = 'Capture Bundle Below..';
                    $scope.checkSession();
                    break;
                case 3:
                    $scope.activateTab('tab-bundle');
                    $scope.currentTask.name = 'Bundles';
                    $scope.currentTask.message = 'Download Address CSV';
                    $scope.checkSession(function(err) {
                        $scope.userBundles();
                    });
                    break;
            }

            $rootScope.$evalAsync(function() {
                $rootScope.PageMeta.title = 'Email Setup - Step ' + $scope.stepPos;
                $scope.pageview();
                $scope.gaevent('setup', 'email-capture', 'step', step);
            });
        }
    });

    $scope.continue = function() {
        $scope.stepPos += 1;
    }

    // step 0
    $scope.authorize = function() {

    };

    // step 1
    $scope.start = function() {
        if ($scope.loggedInUser.labels && $scope.loggedInUser.labels.length > 0) {
            $scope.thisLabels = $scope.loggedInUser.labels;
        } else {
           $scope.gapiLabels();
        }
    };

    $scope.save = function() {
        $scope.checkSession();
        $scope.loggedInUser.labels = $scope.thisLabels;
        DS.save('user', $scope.loggedInUser._id).then(function() {
            $scope.stepPos = 2;
        }).catch(function(err) {
            $log.error(err);
        });
    };

    $scope.gapiLabels = function() {
        $http.get('/api/gapi/labels').success(function(result) {
            if (result.labels) {
                $scope.thisLabels = result.labels;
            }
        }).catch(function(err) {
            $scope.currentTask.message = err.message ? err.message : err;
        });
    };

    // step 2
    $scope.gapiCapture = function() {
        $scope.currentTask.progress = 10;
        $scope.currentTask.message = 'Capturing Google Threads.. (This Make Take Awhile)';
        $http.get('/api/gapi/capture').success(function(result) {
            $scope.currentTask.progress = 100;
            $scope.currentTask.message = result.count + " Addresses Captured";
            $scope.currentTask.sample = result.sample;
        }).catch(function(err) {
            $scope.currentTask.progress = 0;
            $scope.currentTask.message = err.message ? err.message : JSON.stringify(err, null, 2);
        });
    };

    // step 3
    $scope.userBundles = function() {
        $scope.thisBundles = [];
        $http.get('/api/users/bundles').success(function(result) {
            $scope.$evalAsync(function() {
                $scope.thisBundles = result;
            });
        });
    };


  }]);