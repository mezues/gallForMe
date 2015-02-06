'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var weatherforcasts = require('../../app/controllers/weatherforcasts.server.controller');

	app.route('/weather').get(weatherforcasts.weather);

	// Finish by binding the Weatherforcast middleware
	app.param('weatherforcastId', weatherforcasts.weatherforcastByID);
};
