(function () {
  'use strict';

  describe('Tekerays List Controller Tests', function () {
    // Initialize global variables
    var TekeraysListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TekeraysService,
      mockTekeray;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TekeraysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TekeraysService = _TekeraysService_;

      // create mock article
      mockTekeray = new TekeraysService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Tekeray Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Tekerays List controller.
      TekeraysListController = $controller('TekeraysListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockTekerayList;

      beforeEach(function () {
        mockTekerayList = [mockTekeray, mockTekeray];
      });

      it('should send a GET request and return all Tekerays', inject(function (TekeraysService) {
        // Set POST response
        $httpBackend.expectGET('api/tekerays').respond(mockTekerayList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.tekerays.length).toEqual(2);
        expect($scope.vm.tekerays[0]).toEqual(mockTekeray);
        expect($scope.vm.tekerays[1]).toEqual(mockTekeray);

      }));
    });
  });
}());
