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
		 	{
		 		label: 'pression hPa',
		 		value: 'altim_in_hg',
		 		tranform : function(val){
		 			return 33.7685 * val;
		 		}
		 	},
		 	{
		 		label: 'point de rosée °C',
		 		value: 'dewpoint_c',
		 		tranform : function(val){
		 			return val;
		 		}
		 	},
		 	{
		 		label: 'altitude m',
		 		value: 'elevation_m',
		 		tranform : function(val){
		 			return val;
		 		}
		 	},
		 	{
		 		label: 'température de lair',
		 		value: 'temp_c',
		 		tranform : function(val){
		 			return val;
		 		}
		 	},
		 	{
		 		label: 'visibilité mille nautique',
		 		value: 'visibility_statute_mi',
		 		tranform : function(val){
		 			return 0.8689762419006 * val;
		 		}
		 	},
		 	{
		 		label: 'direction vent °',
		 		value: 'wind_dir_degrees',
		 		tranform : function(val){
		 			return val;
		 		}
		 	},
		 	{
		 		label: 'vitesse vent noeuds',
		 		value: 'wind_speed_kt',
		 		tranform : function(val){
		 			return val;
		 		}
		 	}
		];

		$scope.weatherParam1 = $scope.options[1];
		$scope.weatherParam2 = $scope.options[1];

		$scope.map = {
			center: {
				latitude: 48.4,
				longitude: -4.30
			},
			zoom: 10,
			bounds: {}
		};

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
						marker.setIcon('https://www.google.com/mapfiles/marker_green.png');
					}
				}
			});
		}

		function createChart(){
			var windRows = [];
			var param1 = $scope.weatherParam1;
			var param2 = $scope.weatherParam2;

			for(var i = 0 ; i < weathers.length ; i++){
				var windRow = {};
				windRow.c = [
					{
						'v': weathers[i].observation_time
					},
					{
						'v': param1.tranform(weathers[i][param1.value])
					},
					{
						'v': param1.tranform(weathers[i][param2.value])
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
						'label': $scope.weatherParam1.label,
						'type': 'number',
						'p': {}
					},
					{
						'id': 'second_Param',
						'label': $scope.weatherParam2.label,
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
						0: {'title': $scope.weatherParam1.label},
						1: {'title': $scope.weatherParam2.label}
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