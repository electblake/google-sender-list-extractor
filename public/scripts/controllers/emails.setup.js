'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsSetupCtrl
 * @description
 * # EmailsSetupCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsSetupCtrl', ['$scope', '$http', '$log', 'DS', '$timeout', function ($scope, $http, $log, DS, $timeout) {
    var _ = window._;
    $scope.stepPos = 0;
    $scope.currentTask = {
        name: 'Welcome',
        message: 'Initializing..',
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

    var onceLoggedInUser = $scope.$watch('loggedInUser', function(user) {
        if (user) {
            onceLoggedInUser();
        
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
                                $scope.start();
                                break;
                            case 2:
                                $scope.activateTab('tab-capture');
                                $scope.currentTask.name = 'Capture Addresses';
                                $scope.currentTask.message = 'Capture Bundle Below..';
                                break;
                            case 3:
                                $scope.activateTab('tab-bundle');
                                $scope.currentTask.name = 'Bundle and Save';
                                $scope.currentTask.message = 'Bundling Email Addresses..';
                                break;
                        }
                }
            });
        }

    });

    $scope.continue = function() {
        $scope.stepPos += 1;
    }

    // step 0
    $scope.authorize = function() {
        // if ($scope.stepPos === 0) {
        //     $scope.stepPos = 1;
        // }
    };

    // step 1
    $scope.start = function() {
        if ($scope.loggedInUser.labels && $scope.loggedInUser.labels.length > 0) {
            $scope.thisLabels = $scope.loggedInUser.labels;
            // if (_.where($scope.thisLabels, { use: true }).length > 0) {
            //     $scope.stepPos = 2;
            // }
        } else {
           $scope.gapiLabels();
        }
    };

    $scope.save = function() {
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
            // $scope.currentTask.message = 'Finished! Now bundle and download..';
            $scope.currentTask.message = result.count + " Addresses Captured.";
            $scope.currentTask.sample = result.sample;
        }).catch(function(err) {
            $scope.currentTask.progress = 0;
            $scope.currentTask.message = err.message ? err.message : JSON.stringify(err, null, 2);
        });
    };
    // step 3
    $scope.download = function() {

    };

    $scope.getSample = function() {

    };

  }]);