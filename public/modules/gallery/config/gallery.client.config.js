'use strict';

// Configuring the Articles module
angular.module('gallery').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Album', 'album', 'dropdown', '/albumslist',true,['admin']);
		Menus.addSubMenuItem('topbar', 'album', 'Reload db', 'albumslist');
	}
]);