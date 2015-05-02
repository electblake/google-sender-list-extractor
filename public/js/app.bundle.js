angular.module('addressBundlerApp', [
	'ui.router',
	'addressBundlerConfig',
	'addressBundlerDirectives',
	'addressBundlerFilters',
	'addressBundlerRun'
]);

angular.module('addressBundlerConfig', []);
angular.module('addressBundlerDirectives', []);
angular.module('addressBundlerFilters', []);
angular.module('addressBundlerRun', []);
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
  .controller('AppRootCtrl', ['$scope', '$http', '$log', '$rootScope', '$q', function ($scope, $http, $log, $rootScope, $q) {

	  	var loginSession = $q.defer();
	  	$rootScope.loginSession = loginSession.promise;

    	$http.get('/auth/session').success(function(result) {
    	    loginSession.resolve(result);
    	}).catch(function(err) {
    		loginSession.reject(err);
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