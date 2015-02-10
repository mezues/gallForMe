'use strict';

// Weatherforcasts controller
angular.module('weatherforcasts').controller('WeatherforcastsController', ['$scope', '$http', 'Authentication', 'Weatherforcasts',
	function($scope, $http, Authentication, Weatherforcasts) {
		$scope.authentication = Authentication;

		$scope. markers = [];
		var weathers = {};

		function getWeather(airport_id){
			$http.get('/weather/' + airport_id).success(function(weather) {
				var d = new Date(weather.observation_time);
				weather.observation_time = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
				$scope.weatherParam = weather;
			});
			$http.get('/weathers/' + airport_id).success(function(weather) {
				weathers = weather;
				createChart();
			});
		}

		var airportId = [
			{
				name: 'LFRB',
				latitude: 48.45,
				longitude: -4.42
			},
			{
				name: 'LFRL',
				latitude: 48.27,
				longitude: -4.42
			},
			{
				name: 'LFRJ',
				latitude: 48.52,
				longitude: -4.15
			},
			{
				name: 'LFRQ',
				latitude: 47.97,
				longitude: -4.17
			}

		];

		 $scope.options = [
		 	{ label: 'altim_in_hg', value: 'altim_in_hg'},
		 	{ label: 'dewpoint_c', value: 'dewpoint_c'},
		 	{ label: 'elevation_m', value: 'elevation_m'},
		 	{ label: 'temp_c', value: 'temp_c'},
		 	{ label: 'visibility_statute_mi', value: 'visibility_statute_mi'},
		 	{ label: 'wind_dir_degrees', value: 'wind_dir_degrees'},
		 	{ label: 'wind_speed_kt', value: 'wind_speed_kt'}
			];

		$scope.weatherParam1 = $scope.options[1];
		$scope.weatherParam2 = $scope.options[1];

		$scope.map = { center: { latitude: 48.4, longitude: -4.30 }, zoom: 10 };

		for(var i = 0 ; i < airportId.length ; i++){
			$scope.markers.push({
				coords: {
					latitude: airportId[i].latitude,
					longitude: airportId[i].longitude
				},
				title: airportId[i].name,
				id: airportId[i].name,
				events: {
					click: function (marker, eventName, args) {
						getWeather(marker.key);
					}
				}
			});
		}

		function createChart(){
			var windRows = [];
			for(var i = 0 ; i < weathers.length ; i++){
				var windRow = {};
				windRow.c = [
					{
						'v': weathers[i].observation_time
					},
					{
						'v': weathers[i][$scope.weatherParam1.value]
					},
					{
						'v': weathers[i][$scope.weatherParam2.value]
					}
				];
				windRows.push(windRow);
			}
			$scope.windChart = {
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
						'id': 'first_Param',
						'label': $scope.weatherParam1.value,
						'type': 'number',
						'p': {}
					},
					{
						'id': 'second_Param',
						'label': $scope.weatherParam2.value,
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
						0: {'title': $scope.weatherParam1.value},
						1: {'title': $scope.weatherParam2.value}
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

		$scope.ngCreateChart= function(){
			createChart();
		};

	}

]);