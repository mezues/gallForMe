'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Weatherforcast Schema
 */
var WeatherforcastSchema = new Schema({
	observation_time: {
		type: Date
	},
	station_id: {
		type: String
	},
	latitude: {
		type: Number
	},
	longitude: {
		type: Number
	},
	temp_c: {
		type: Number
	},
	dewpoint_c: {
		type: Number
	},
	wind_dir_degrees: {
		type: Number
	},
	wind_speed_kt: {
		type: Number
	},
	visibility_statute_mi: {
		type: Number
	},
	altim_in_hg: {
		type: Number
	},
	sky_condition: {
		type: [{
			type: String
		}],
	},
	elevation_m: {
		type: Number
	}
});

var WeatherforcastModel = mongoose.model('Weatherforcast',WeatherforcastSchema);

WeatherforcastSchema.pre('save', function (next) {
	var self = this;
	WeatherforcastModel.find({observation_time : self.observation_time, station_id : self.station_id}, function (err, forecast) {
		if (!forecast.length){
			next();
		}
	});
});

mongoose.model('Weatherforcast', WeatherforcastSchema);