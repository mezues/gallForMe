'use strict';

angular.module('gallery').controller('GalleryController',['$scope', '$stateParams', '$location', '$http', '$animate',
	function($scope, $stateParams, $location, $http, $animate){
		var albums;
		$scope.photouser={};
		$scope.admin = false;
		$scope.myInterval = 3000;
		$scope.side = 'front';

		$scope.download = function(photo) {
			$http.get('/photoDownload/' + photo._id).success(function(data){
				console.log(data);
    // var hiddenElement = document.createElement('a');

document.location = 'data:application/csv;charset=utf-8,'+encodeURI(data);
    // hiddenElement.href = 'data:attachment/csv,' + encodeURI(data);
    // hiddenElement.target = '_blank';
    // hiddenElement.download = 'myFile.csv';
    // hiddenElement.click();

			});
		}

		$scope.toggle = function(photo) {
			$scope.side = $scope.side == 'back' ? 'front' : 'back';
		}

		$scope.createDb = function() {
			if(!albums){
				$http.post('albumslist').success(function(data) {
					albums = data;
				});
			}
		};

		$scope.findAlbums = function() {
			$http.get('/albums/' + $stateParams.albumId).success(function(albums){
				$scope.albums = albums;
			});
		};


		$scope.findPhotos = function() {

			$animate.enabled(true);
			$http.get('users').success(function(users) {
				$scope.users = users;
				$http.get('/photos/' + $stateParams.albumId).success(function(photos){
					$scope.photos = photos;
					for(var j = 0 ; j < $scope.photos.length; j++){
						var photo = $scope.photos[j];
						$scope.photouser[photo._id] = {};
						for(var i = 0 ; i < $scope.users.length; i++){
							var user = $scope.users[i];
							if (photo.users.indexOf(user.id)>-1){
								$scope.photouser[photo._id][user.id] = true;
							}else{
								$scope.photouser[photo._id][user.id] = false;
							}
						}
				}
				});
			});
		};
		$scope.findPhoto = function() {

			$animate.enabled(false);
			$http.get('users').success(function(users) {
				$scope.users = users;
				$http.get('/photos/' + $stateParams.photoId).success(function(photos){
					$scope.photos = photos;
				});
			});
		};

		$scope.nextPhoto = function(photoName){
			$http.get('/photoNext/' + photoName).success(function(photo){
				$scope.photo = photo;
			});
		};

		$scope.prevPhoto = function(photoName){
			$http.get('/photoPrev/' + photoName).success(function(photo){
				$scope.photo = photo;
			});
		};

		$scope.addImageToUser = function(user, photo) {
			$scope.userPhotoMap = {photo: photo, user : user};
			if (photo.users.indexOf(user.id)>-1){
				$http.put('/photo/delUser', {user:user, photo:photo});
				var i = photo.users.indexOf(user.id);
				if(i !== -1) {
					photo.users.splice(i, 1);
				}
			}else{
				$http.put('/photo/addUser', {user:user, photo:photo});
				photo.users.push(user.id);
			}
		};
	}
]);