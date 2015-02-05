'use strict';

angular.module('gallery').controller('PhotoController',['$scope', '$stateParams', '$http', '$animate',
	function($scope, $stateParams, $http, $animate){

		$animate.enabled(false);
		$scope.findPhoto = function() {

			$http.get('users').success(function(users) {
				$scope.users = users;
				$http.get('/photos/' + $stateParams.photoId).success(function(photos){
					$scope.photos = photos;
				});
			});
		};
	}
	]);