'use strict';

//Weatherforcasts service used to communicate Weatherforcasts REST endpoints
angular.module('weatherforcasts').factory('Weatherforcasts', ['$resource',
	function($resource) {
		return $resource('weatherforcasts/:weatherforcastId', { weatherforcastId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);