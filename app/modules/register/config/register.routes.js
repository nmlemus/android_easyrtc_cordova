'use strict';

//Setting up route
angular.module('register').config(['$stateProvider',
	function($stateProvider) {
		// Register state routing
		$stateProvider.
		state('register', {
			url: '/register',
			templateUrl: 'modules/register/views/register.html',
            controller: 'RegisterController'
		});
	}
]);
