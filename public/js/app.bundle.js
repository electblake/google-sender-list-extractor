angular.module('addressBundlerApp', [
	'js-data',
	'ui.router',
	'addressBundlerConfig',
	'addressBundlerDirectives',
	'addressBundlerFilters',
	'addressBundlerRun'
]).run(['DS', function(DS) {
	// DS.defineResource('user');
}]);

angular.module('addressBundlerConfig', []);
angular.module('addressBundlerDirectives', []);
angular.module('addressBundlerFilters', []);
angular.module('addressBundlerServices', []);
angular.module('addressBundlerRun', []);
angular.module('addressBundlerConfig')
  .config(['DSProvider', function (DSProvider) {
    DSProvider.defaults.basePath = '/api'; // etc.
  }]);
angular.module('addressBundlerConfig')
	.run(['DS', function(DS) {
		DS.defineResource({
			name: 'user',
			endpoint: 'users',
			idAttribute: '_id',
			beforeUpdate: function(resource, attrs, cb) {
				attrs.updated = (new Date);
				cb(null, attrs);
			}
		});
	}])
angular.module('addressBundlerConfig')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				'url': '/home',
				'templateUrl': 'views/home.html',
				'controller': 'HomeCtrl'
			})
			.state('emails', {
				'abstract': true,
				'controller': 'EmailsAbstractCtrl',
				'url': '/emails',
				'template': '<div ui-view></div>'
			})
			.state('emails.start', {
				url: '/start?step-pos',
				templateUrl: 'views/emails/start.html'
			})
			.state('emails.setup', {
				url: '/setup?step-pos',
				controller: 'EmailsSetupCtrl',
				templateUrl: 'views/emails/setup.html'
			});
	}]);
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
    		DS.find('user', result.userId);
            DS.bindOne('user', result.userId, $rootScope, 'loggedInUser');
    	});

  }]);

'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsAbstractCtrl
 * @description
 * # EmailsAbstractCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsAbstractCtrl', ['$scope', function ($scope) {
    
  }]);
'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsBundleCtrl
 * @description
 * # EmailsBundleCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsBundleCtrl', ['$scope', function ($scope) {
    
  }]);

'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsSetupCtrl
 * @description
 * # EmailsSetupCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsSetupCtrl', ['$scope', '$http', '$log', 'DS', function ($scope, $http, $log, DS) {
    $scope.tasks = [];

    $scope.stepPos = 0;

    $scope.tasks.push({
    	name: 'Get Started',
    	progress: '0',
    	message: 'Waiting to Google..',
    	url: '/api/addresses/capture-labels'
    });

    window.jQuery(document).ready(function(){
        window.jQuery('ul.tabs').tabs();
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

    $scope.filterLabelsExclude = function(row) {
        if (row.use === true) {
            return false;
        }
        return true;
    };

    $scope.save = function() {
        $scope.$evalAsync(function() {
            $scope.loggedInUser.labels = $scope.thisLabels;
            // console.log('First label saved..', $scope.thisLabels[0]);
            DS.save('user', $scope.loggedInUser._id).then(function() {
                $scope.stepPos += 1;
            }).catch(function(err) {
                $log.error(err);
            });
        });
    };

    $scope.authorize = function() {

    };

    $scope.$watch('stepPos', function(step, previous) {
        if (step >= 0 && step != previous) {

            switch(step) {
                case 0:
                default:
                    $scope.authorize();
                case 1:
                    $scope.start();
                case 2:
                    $scope.currentTask.message = 'Configure Bundle Below..';
                case 3:
                    $scope.currentTask.name = 'Capturing Email Addresses..';
                    $scope.currentTask.message = 'Initializing..';
                case 4:
                    $scope.currentTask.message = 'Bundling Email Addresses..';
            }
        }
    });

    $scope.setupLabels = function() {
        $http.get('/api/labels/setup').success(function(result) {
            if (result.labels) {
                $scope.thisLabels = result.labels;
                $scope.stepPos += 1;
            }
        }).catch(function(err) {
            $scope.currentTask.message = err.message ? err.message : err;
        });
    };

    $scope.start = function() {

        var onceloggedInUser = $scope.$watch('loggedInUser', function(user, previous) {
            if (user && $scope.loggedInUser) {
                onceloggedInUser();

                if ($scope.loggedInUser.labels && $scope.loggedInUser.labels.length > 0) {
                    $scope.thisLabels = user.labels;
                    $scope.stepPos += 1;
                } else {
                   $scope.setupLabels();
                }
            }
        });
    };

  }]);
'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:EmailsStartCtrl
 * @description
 * # EmailsStartCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('EmailsStartCtrl', ['$scope', function ($scope) {
    
  }]);

'use strict';

/**
 * @ngdoc function
 * @name addressBundlerApp.controller:HomCtrl
 * @description
 * # HomCtrl
 * Controller of the addressBundlerApp
 */
angular.module('addressBundlerApp')
  .controller('HomeCtrl', ['$scope', '$log', function ($scope, $log) {
   	$log.debug('HomeCtrl');
  }]);