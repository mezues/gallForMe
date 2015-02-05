'use strict';

// Setting up route
angular.module('gallery').config(['$stateProvider',
	function($stateProvider) {
		// Gallery state routing
		$stateProvider.
		state('album', {
			url: '/gallery/album/:albumId',
			templateUrl: 'modules/gallery/views/album.client.view.html'
		});
		$stateProvider.
		state('photo', {
			url: '/gallery/photo/:photoId',
			templateUrl: 'modules/gallery/views/photo.client.view.html'
		});
		$stateProvider.
		state('createDb', {
			url: '/createDb',
			templateUrl: 'modules/gallery/views/db.client.view.html'
		});
	}
]);