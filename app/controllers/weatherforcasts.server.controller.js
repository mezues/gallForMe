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

function ping (station_id, callback){

	var options = {
		host: 'aviationweather.gov',
		port: 80,
		path: '/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=' + station_id +'&hoursBeforeNow=2'
	};

	http.get(options, function(response) {
		var body = '';
		response.on('data', function(chunk) {
			body += chunk;
		});
		response.on('end', function() {
			parseString(body, function (err, result) {
				var weather = {};
				weather.observation_time = result.response.data[0].METAR[0].observation_time[0];
				weather.station_id = result.response.data[0].METAR[0].station_id[0];
				weather.latitude = result.response.data[0].METAR[0].latitude[0];
				weather.longitude = result.response.data[0].METAR[0].longitude[0];
				weather.temp_c = result.response.data[0].METAR[0].temp_c[0];
				weather.dewpoint_c = result.response.data[0].METAR[0].dewpoint_c[0];
				weather.wind_dir_degrees = result.response.data[0].METAR[0].wind_dir_degrees[0];
				weather.wind_speed_kt = result.response.data[0].METAR[0].wind_speed_kt[0];
				weather.visibility_statute_mi = result.response.data[0].METAR[0].visibility_statute_mi[0];
				weather.altim_in_hg = result.response.data[0].METAR[0].altim_in_hg[0];
				var rawSkyCond = result.response.data[0].METAR[0].sky_condition;
				var jsonSkyCond = [];
				if(rawSkyCond)
					for(var i = 0 ; i < rawSkyCond.length ; i++){
						jsonSkyCond.push(JSON.stringify(rawSkyCond[i]))
					}

				weather.sky_condition = jsonSkyCond;
				weather.elevation_m = result.response.data[0].METAR[0].elevation_m[0];
				callback(weather);

			});
		});
	}).on('error', function(e) {
		console.log('Got error: ' + e.message);
	});
}

function queryLFRBForecast (){
	var station_id = 'LFRB';
	ping(station_id, function (weather) {
		var weatherDb = new Weatherforcast(weather);
		weatherDb.save();
	});
}

function queryLFRLForecast (){
	var station_id = 'LFRL';
	ping(station_id, function (weather) {
		var weatherDb = new Weatherforcast(weather);
		weatherDb.save();
	});
}
setInterval(queryLFRBForecast, 30 * 60 * 1000);
setInterval(queryLFRLForecast, 30 * 60 * 1000);


exports.weather = function(req, res) {
	Weatherforcast.findOne({'station_id': req.params.airportId} , {}, { sort: { 'observation_time' : -1 } }, function(err, weather) {
		res.json(weather);
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
