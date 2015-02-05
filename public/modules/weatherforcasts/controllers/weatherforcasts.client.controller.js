'use strict';

// Weatherforcasts controller
angular.module('weatherforcasts').controller('WeatherforcastsController', ['$scope', '$http', 'Authentication', 'Weatherforcasts',
	function($scope, $http, Authentication, Weatherforcasts) {
		$scope.authentication = Authentication;

		$scope.getWeather = function(){
			$http.get('/weather').success(function(weather) {
				$scope.weather = weather;

				$scope.station_id = weather[0].station_id[0];
				$scope.windAngle0 = weather[0].wind_dir_degrees[0];
				var d = new Date(weather[0].observation_time[0]);
				$scope.obsTime0 = d.toLocaleDateString() + " " + d.toLocaleTimeString();
				$scope.windSpeed0 = weather[0].wind_speed_kt[0];
				$scope.temperature0 = weather[0].temp_c[0];

				$scope.windAngle1 = weather[1].wind_dir_degrees[0];
				d = new Date(weather[1].observation_time[0]);
				$scope.obsTime1 = d.toLocaleDateString() + " " + d.toLocaleTimeString();
				$scope.windSpeed1 = weather[1].wind_speed_kt[0];
				$scope.temperature1 = weather[1].temp_c[0];

				$scope.windAngle2 = weather[2].wind_dir_degrees[0];
				d = new Date(weather[2].observation_time[0]);
				$scope.obsTime2 = d.toLocaleDateString() + " " + d.toLocaleTimeString();
				$scope.windSpeed2 = weather[2].wind_speed_kt[0];
				$scope.temperature2 = weather[2].temp_c[0];
			});
		};
	}

]);