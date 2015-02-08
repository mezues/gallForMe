'use strict';

// Weatherforcasts controller
angular.module('weatherforcasts').controller('WeatherforcastsController', ['$scope', '$http', 'Authentication', 'Weatherforcasts',
	function($scope, $http, Authentication, Weatherforcasts) {
		$scope.authentication = Authentication;

		$scope. markers = [];
		$scope.weatherParams = [];

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



		function createChart(weathers){
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
			$http.get('/weathers/' + station_id).success(function(weathers) {
				createChart(weathers);
			});
		};

// 		$scope.chartObject = {
//   "type": "AreaChart",
//   "displayed": true,
//   "data": {
//     "cols": [
//       {
//         "id": "month",
//         "label": "Month",
//         "type": "string",
//         "p": {}
//       },
//       {
//         "id": "laptop-id",
//         "label": "Laptop",
//         "type": "number",
//         "p": {}
//       },
//       {
//         "id": "desktop-id",
//         "label": "Desktop",
//         "type": "number",
//         "p": {}
//       },
//       {
//         "id": "server-id",
//         "label": "Server",
//         "type": "number",
//         "p": {}
//       },
//       {
//         "id": "cost-id",
//         "label": "Shipping",
//         "type": "number"
//       }
//     ],
//     "rows": [
//       {
//         "c": [
//           {
//             "v": "January"
//           },
//           {
//             "v": 19,
//             "f": "42 items"
//           },
//           {
//             "v": 12,
//             "f": "Ony 12 items"
//           },
//           {
//             "v": 7,
//             "f": "7 servers"
//           },
//           {
//             "v": 4
//           }
//         ]
//       },
//       {
//         "c": [
//           {
//             "v": "February"
//           },
//           {
//             "v": 13
//           },
//           {
//             "v": 1,
//             "f": "1 unit (Out of stock this month)"
//           },
//           {
//             "v": 12
//           },
//           {
//             "v": 2
//           }
//         ]
//       },
//       {
//         "c": [
//           {
//             "v": "March"
//           },
//           {
//             "v": 24
//           },
//           {
//             "v": 5
//           },
//           {
//             "v": 11
//           },
//           {
//             "v": 6
//           }
//         ]
//       }
//     ]
//   },
//   "options": {
//     "title": "Sales per month",
//     "isStacked": "true",
//     "fill": 20,
//     "displayExactValues": true,
//     "vAxis": {
//       "title": "Sales unit",
//       "gridlines": {
//         "count": 10
//       }
//     },
//     "hAxis": {
//       "title": "Date"
//     }
//   },
//   "formatters": {}
// }
	}

]);