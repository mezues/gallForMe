'use strict';

angular.module('gallery').controller('DbController',['$scope', '$http',
	function($scope, $http){

		$scope.createDb = function() {
				$http.post('albumslist').success(function(data) {
			});
		};
	}
]);