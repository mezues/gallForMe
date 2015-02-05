'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Weatherforcast = mongoose.model('Weatherforcast'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, weatherforcast;

/**
 * Weatherforcast routes tests
 */
describe('Weatherforcast CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Weatherforcast
		user.save(function() {
			weatherforcast = {
				name: 'Weatherforcast Name'
			};

			done();
		});
	});

	it('should be able to save Weatherforcast instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Weatherforcast
				agent.post('/weatherforcasts')
					.send(weatherforcast)
					.expect(200)
					.end(function(weatherforcastSaveErr, weatherforcastSaveRes) {
						// Handle Weatherforcast save error
						if (weatherforcastSaveErr) done(weatherforcastSaveErr);

						// Get a list of Weatherforcasts
						agent.get('/weatherforcasts')
							.end(function(weatherforcastsGetErr, weatherforcastsGetRes) {
								// Handle Weatherforcast save error
								if (weatherforcastsGetErr) done(weatherforcastsGetErr);

								// Get Weatherforcasts list
								var weatherforcasts = weatherforcastsGetRes.body;

								// Set assertions
								(weatherforcasts[0].user._id).should.equal(userId);
								(weatherforcasts[0].name).should.match('Weatherforcast Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Weatherforcast instance if not logged in', function(done) {
		agent.post('/weatherforcasts')
			.send(weatherforcast)
			.expect(401)
			.end(function(weatherforcastSaveErr, weatherforcastSaveRes) {
				// Call the assertion callback
				done(weatherforcastSaveErr);
			});
	});

	it('should not be able to save Weatherforcast instance if no name is provided', function(done) {
		// Invalidate name field
		weatherforcast.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Weatherforcast
				agent.post('/weatherforcasts')
					.send(weatherforcast)
					.expect(400)
					.end(function(weatherforcastSaveErr, weatherforcastSaveRes) {
						// Set message assertion
						(weatherforcastSaveRes.body.message).should.match('Please fill Weatherforcast name');
						
						// Handle Weatherforcast save error
						done(weatherforcastSaveErr);
					});
			});
	});

	it('should be able to update Weatherforcast instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Weatherforcast
				agent.post('/weatherforcasts')
					.send(weatherforcast)
					.expect(200)
					.end(function(weatherforcastSaveErr, weatherforcastSaveRes) {
						// Handle Weatherforcast save error
						if (weatherforcastSaveErr) done(weatherforcastSaveErr);

						// Update Weatherforcast name
						weatherforcast.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Weatherforcast
						agent.put('/weatherforcasts/' + weatherforcastSaveRes.body._id)
							.send(weatherforcast)
							.expect(200)
							.end(function(weatherforcastUpdateErr, weatherforcastUpdateRes) {
								// Handle Weatherforcast update error
								if (weatherforcastUpdateErr) done(weatherforcastUpdateErr);

								// Set assertions
								(weatherforcastUpdateRes.body._id).should.equal(weatherforcastSaveRes.body._id);
								(weatherforcastUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Weatherforcasts if not signed in', function(done) {
		// Create new Weatherforcast model instance
		var weatherforcastObj = new Weatherforcast(weatherforcast);

		// Save the Weatherforcast
		weatherforcastObj.save(function() {
			// Request Weatherforcasts
			request(app).get('/weatherforcasts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Weatherforcast if not signed in', function(done) {
		// Create new Weatherforcast model instance
		var weatherforcastObj = new Weatherforcast(weatherforcast);

		// Save the Weatherforcast
		weatherforcastObj.save(function() {
			request(app).get('/weatherforcasts/' + weatherforcastObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', weatherforcast.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Weatherforcast instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Weatherforcast
				agent.post('/weatherforcasts')
					.send(weatherforcast)
					.expect(200)
					.end(function(weatherforcastSaveErr, weatherforcastSaveRes) {
						// Handle Weatherforcast save error
						if (weatherforcastSaveErr) done(weatherforcastSaveErr);

						// Delete existing Weatherforcast
						agent.delete('/weatherforcasts/' + weatherforcastSaveRes.body._id)
							.send(weatherforcast)
							.expect(200)
							.end(function(weatherforcastDeleteErr, weatherforcastDeleteRes) {
								// Handle Weatherforcast error error
								if (weatherforcastDeleteErr) done(weatherforcastDeleteErr);

								// Set assertions
								(weatherforcastDeleteRes.body._id).should.equal(weatherforcastSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Weatherforcast instance if not signed in', function(done) {
		// Set Weatherforcast user 
		weatherforcast.user = user;

		// Create new Weatherforcast model instance
		var weatherforcastObj = new Weatherforcast(weatherforcast);

		// Save the Weatherforcast
		weatherforcastObj.save(function() {
			// Try deleting Weatherforcast
			request(app).delete('/weatherforcasts/' + weatherforcastObj._id)
			.expect(401)
			.end(function(weatherforcastDeleteErr, weatherforcastDeleteRes) {
				// Set message assertion
				(weatherforcastDeleteRes.body.message).should.match('User is not logged in');

				// Handle Weatherforcast error error
				done(weatherforcastDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Weatherforcast.remove().exec();
		done();
	});
});