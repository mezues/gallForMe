'use strict';

// Configuring the Articles module
angular.module('gallery').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Album', 'gallery', 'dropdown', '',true,['admin']);
		Menus.addSubMenuItem('topbar', 'gallery', 'Reload db', 'createDb');
	}
]);