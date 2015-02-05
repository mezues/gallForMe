'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Weatherforcast = mongoose.model('Weatherforcast');

/**
 * Globals
 */
var user, weatherforcast;

/**
 * Unit tests
 */
describe('Weatherforcast Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			weatherforcast = new Weatherforcast({
				name: 'Weatherforcast Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return weatherforcast.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			weatherforcast.name = '';

			return weatherforcast.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Weatherforcast.remove().exec();
		User.remove().exec();

		done();
	});
});