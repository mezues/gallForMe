'use strict';

// Configuring the Articles module
angular.module('gallery').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Album', 'gallery', 'dropdown', '',false);
		Menus.addSubMenuItem('topbar', 'gallery', 'show album', 'gallery/album/', '', false);
		Menus.addSubMenuItem('topbar', 'gallery', 'Reload db', 'createDb', '', false, ['admin']);
	}
]);