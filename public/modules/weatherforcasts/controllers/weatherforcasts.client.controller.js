'use strict';

// Weatherforcasts controller
angular.module('weatherforcasts').controller('WeatherforcastsController', ['$scope', '$http', 'Authentication', 'Weatherforcasts',
	function($scope, $http, Authentication, Weatherforcasts) {
		$scope.authentication = Authentication;

		$scope. markers = [];
		$scope.weatherParams = [];
		$scope.windChart = {};

		var airportId = ['LFRB', 'LFRL'];

			$scope.map = { center: { latitude: 48.4, longitude: -4.30 }, zoom: 10 };

		$scope.getWeather = function(){
			var id = 0;
			for(var i = 0 ; i < airportId.length ; i++){

				$http.get('/weather/' + airportId[i]).success(function(weather) {
					var latitude = weather.latitude;
					var longitude = weather.longitude;

					$scope.markers.push({
						latitude: latitude,
						longitude: longitude,
						title: airportId[id],
						id: id
					});
					id += 1;
					var d = new Date(weather.observation_time);
					weather.observation_time = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();

					$scope.weatherParams.push(weather);
				});
			}
		};



		function createChart(weathers, station_id){
			var windRows = [];

			for(var i = 0 ; i < weathers.length ; i++){
				var windRow = {};
				windRow.c = [
					{
						'v': weathers[i].observation_time
					},
					{
						'v': weathers[i].wind_speed_kt
					},
					{
						'v': weathers[i].wind_dir_degrees
					}
				];
				windRows.push(windRow);
			}
			$scope.windChart.station_id = {
				'type': 'LineChart',
				'displayed': true,
				'data': {
					'cols': [
					{
						'id': 'observation_time',
						'label': 'Date',
						'type': 'string',
						'p': {}
					},
					{
						'id': 'wind_speed_kt',
						'label': 'Wind_speed_kt',
						'type': 'number',
						'p': {}
					},
					{
						'id': 'wind_dir_degrees',
						'label': 'Wind_dir_degrees',
						'type': 'number',
						'p': {}
					}
					],
					'rows': windRows
				},
				'options': {
					'title': 'Meteo',
					'isStacked': 'true',
					'fill': 20,
					'displayExactValues': true,
					'series': {
						0: {'targetAxisIndex': 0},
						1: {'targetAxisIndex': 1}
					},
					'vAxes': {
						// Adds titles to each axis.
						0: {'title': 'Wind Speed Kt'},
						1: {'title': 'Wind Direction'}
						},
					'vAxis': {
						'title': 'Sales unit',
						'gridlines': {
							'count': 10
						}
					},
					'hAxis': {
						'title': 'Date'
					}
				},
				'formatters': {}
			};
		}

		$scope.getWeathers = function(station_id){
			$http.get('/weathers/' + station_id).success(function(weathers, station_id) {
				createChart(weathers);
			});
		};

	}

]);