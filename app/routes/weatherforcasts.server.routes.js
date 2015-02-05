'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var weatherforcasts = require('../../app/controllers/weatherforcasts.server.controller');

	app.route('/weather').get(weatherforcasts.weather);
	// Weatherforcasts Routes
	app.route('/weatherforcasts')
		.get(weatherforcasts.list)
		.post(users.requiresLogin, weatherforcasts.create);

	app.route('/weatherforcasts/:weatherforcastId')
		.get(weatherforcasts.read)
		.put(users.requiresLogin, weatherforcasts.hasAuthorization, weatherforcasts.update)
		.delete(users.requiresLogin, weatherforcasts.hasAuthorization, weatherforcasts.delete);

	// Finish by binding the Weatherforcast middleware
	app.param('weatherforcastId', weatherforcasts.weatherforcastByID);
};
