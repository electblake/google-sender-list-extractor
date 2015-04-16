angular.module('addressBundler')
	.config(['$stateProvider', function($stateProvider) {
		$stateProvider
			.state('emails', {
				'abstract': true,
				'controller': 'EmailsAbstractCtrl'
			})
			.state('emails.start', {
				templateUrl: 'views/emails/start.html'
			});
	}]);