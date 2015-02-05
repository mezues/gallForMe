'use strict';

// Configuring the Articles module
angular.module('gallery').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'WeatherForcast', 'weather', 'dropdown', '',false);
        Menus.addSubMenuItem('topbar', 'weather', 'meteo', 'weather', '', false);
    }
]);