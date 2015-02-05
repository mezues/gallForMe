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
	name: {
		type: String,
		default: '',
		required: 'Please fill Weatherforcast name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Weatherforcast', WeatherforcastSchema);