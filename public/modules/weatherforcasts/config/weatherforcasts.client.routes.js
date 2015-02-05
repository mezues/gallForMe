'use strict';

//Setting up route
angular.module('weatherforcasts').config(['$stateProvider',
	function($stateProvider) {
		// Weatherforcasts state routing
		$stateProvider.
		state('weather', {
			url: '/weather',
			templateUrl: 'modules/weatherforcasts/views/weatherforcast.client.view.html'
		});
	}
]);