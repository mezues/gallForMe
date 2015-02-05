'use strict';

// Weatherforcasts controller
angular.module('weatherforcasts').controller('WeatherforcastsController', ['$scope', '$http', 'Authentication', 'Weatherforcasts',
	function($scope, $http, Authentication, Weatherforcasts) {
		$scope.authentication = Authentication;


		$scope.getWeather = function(){
			$http.get('/weather').success(function(weather) {
				console.log("cojdkfhqskjfhklqsh " + weather);
				$scope.weather = weather;
			});
		};

	}
]);