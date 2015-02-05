'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Weatherforcast = mongoose.model('Weatherforcast'),
	http = require('http'),
	_ = require('lodash');
var parseString = require('xml2js').parseString;

exports.weather = function(req, res) {
	var options = {
		host: 'aviationweather.gov',
		port: 80,
		path: '/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=LFRB&hoursBeforeNow=2'
	};

	http.get(options, function(responce) {
		var body = '';
		responce.on('data', function(chunk) {
			body += chunk;
		});
		responce.on('end', function() {
			parseString(body, function (err, result) {
				res.jsonp(result.response.data[0].METAR);
			});
		});
	}).on('error', function(e) {
		console.log('Got error: ' + e.message);
	});
};

/**
 * Create a Weatherforcast
 */
exports.create = function(req, res) {
	var weatherforcast = new Weatherforcast(req.body);
	weatherforcast.user = req.user;

	weatherforcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(weatherforcast);
		}
	});
};

/**
 * Show the current Weatherforcast
 */
exports.read = function(req, res) {
	res.jsonp(req.weatherforcast);
};

/**
 * Update a Weatherforcast
 */
exports.update = function(req, res) {
	var weatherforcast = req.weatherforcast ;

	weatherforcast = _.extend(weatherforcast , req.body);

	weatherforcast.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(weatherforcast);
		}
	});
};

/**
 * Delete an Weatherforcast
 */
exports.delete = function(req, res) {
	var weatherforcast = req.weatherforcast ;

	weatherforcast.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(weatherforcast);
		}
	});
};

/**
 * List of Weatherforcasts
 */
exports.list = function(req, res) {
	Weatherforcast.find().sort('-created').populate('user', 'displayName').exec(function(err, weatherforcasts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(weatherforcasts);
		}
	});
};

/**
 * Weatherforcast middleware
 */
exports.weatherforcastByID = function(req, res, next, id) {
	Weatherforcast.findById(id).populate('user', 'displayName').exec(function(err, weatherforcast) {
		if (err) return next(err);
		if (! weatherforcast) return next(new Error('Failed to load Weatherforcast ' + id));
		req.weatherforcast = weatherforcast ;
		next();
	});
};

/**
 * Weatherforcast authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.weatherforcast.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
