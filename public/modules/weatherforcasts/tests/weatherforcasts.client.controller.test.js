'use strict';

(function() {
	// Weatherforcasts Controller Spec
	describe('Weatherforcasts Controller Tests', function() {
		// Initialize global variables
		var WeatherforcastsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Weatherforcasts controller.
			WeatherforcastsController = $controller('WeatherforcastsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Weatherforcast object fetched from XHR', inject(function(Weatherforcasts) {
			// Create sample Weatherforcast using the Weatherforcasts service
			var sampleWeatherforcast = new Weatherforcasts({
				name: 'New Weatherforcast'
			});

			// Create a sample Weatherforcasts array that includes the new Weatherforcast
			var sampleWeatherforcasts = [sampleWeatherforcast];

			// Set GET response
			$httpBackend.expectGET('weatherforcasts').respond(sampleWeatherforcasts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.weatherforcasts).toEqualData(sampleWeatherforcasts);
		}));

		it('$scope.findOne() should create an array with one Weatherforcast object fetched from XHR using a weatherforcastId URL parameter', inject(function(Weatherforcasts) {
			// Define a sample Weatherforcast object
			var sampleWeatherforcast = new Weatherforcasts({
				name: 'New Weatherforcast'
			});

			// Set the URL parameter
			$stateParams.weatherforcastId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/weatherforcasts\/([0-9a-fA-F]{24})$/).respond(sampleWeatherforcast);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.weatherforcast).toEqualData(sampleWeatherforcast);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Weatherforcasts) {
			// Create a sample Weatherforcast object
			var sampleWeatherforcastPostData = new Weatherforcasts({
				name: 'New Weatherforcast'
			});

			// Create a sample Weatherforcast response
			var sampleWeatherforcastResponse = new Weatherforcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Weatherforcast'
			});

			// Fixture mock form input values
			scope.name = 'New Weatherforcast';

			// Set POST response
			$httpBackend.expectPOST('weatherforcasts', sampleWeatherforcastPostData).respond(sampleWeatherforcastResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Weatherforcast was created
			expect($location.path()).toBe('/weatherforcasts/' + sampleWeatherforcastResponse._id);
		}));

		it('$scope.update() should update a valid Weatherforcast', inject(function(Weatherforcasts) {
			// Define a sample Weatherforcast put data
			var sampleWeatherforcastPutData = new Weatherforcasts({
				_id: '525cf20451979dea2c000001',
				name: 'New Weatherforcast'
			});

			// Mock Weatherforcast in scope
			scope.weatherforcast = sampleWeatherforcastPutData;

			// Set PUT response
			$httpBackend.expectPUT(/weatherforcasts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/weatherforcasts/' + sampleWeatherforcastPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid weatherforcastId and remove the Weatherforcast from the scope', inject(function(Weatherforcasts) {
			// Create new Weatherforcast object
			var sampleWeatherforcast = new Weatherforcasts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Weatherforcasts array and include the Weatherforcast
			scope.weatherforcasts = [sampleWeatherforcast];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/weatherforcasts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWeatherforcast);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.weatherforcasts.length).toBe(0);
		}));
	});
}());