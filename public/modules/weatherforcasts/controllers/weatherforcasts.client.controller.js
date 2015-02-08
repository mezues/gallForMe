'use strict';

// Weatherforcasts controller
angular.module('weatherforcasts').controller('WeatherforcastsController', ['$scope', '$http', 'Authentication', 'Weatherforcasts',
	function($scope, $http, Authentication, Weatherforcasts) {
		$scope.authentication = Authentication;

		$scope. markers = [];
		$scope.weatherParams = [];

		var airportId = ['LFRB', 'LFRL'];

		$scope.getWeather = function(){
			for(var i = 0 ; i < airportId.length ; i++){
				$http.get('/weather/' + airportId[i]).success(function(weather) {
					var latitude = weather.latitude;
					var longitude = weather.longitude;

					$scope.markers.push({
						latitude: latitude,
						longitude: longitude,
						title: airportId[i],
						id: i
					});
					var d = new Date(weather.observation_time);
					weather.observation_time = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();

					$scope.weatherParams.push(weather);
				});
			}
			$scope.map = { center: { latitude: 48.4, longitude: -4.30 }, zoom: 10 };
		};
	}

]);