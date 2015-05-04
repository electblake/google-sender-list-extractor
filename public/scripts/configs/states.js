angular.module('addressBundlerConfig')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				'url': '/home',
				'templateUrl': 'views/home.html',
				'controller': 'HomeCtrl'
			})
			.state('logout', {
				'controller': 'LogoutCtrl',
				'url': '/logout',
				'template': '<div ui-view></div>'
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