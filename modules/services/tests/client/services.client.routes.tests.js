(function () {
  'use strict';

  describe('Services Route Tests', function () {
    // Initialize global variables
    var $scope,
      ServicesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ServicesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ServicesService = _ServicesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('services');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/services');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ServicesController,
          mockService;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('services.view');
          $templateCache.put('modules/services/client/views/view-service.client.view.html', '');

          // create mock Service
          mockService = new ServicesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Service Name'
          });

          // Initialize Controller
          ServicesController = $controller('ServicesController as vm', {
            $scope: $scope,
            serviceResolve: mockService
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:serviceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.serviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            serviceId: 1
          })).toEqual('/services/1');
        }));

        it('should attach an Service to the controller scope', function () {
          expect($scope.vm.service._id).toBe(mockService._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/services/client/views/view-service.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ServicesController,
          mockService;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('services.create');
          $templateCache.put('modules/services/client/views/form-service.client.view.html', '');

          // create mock Service
          mockService = new ServicesService();

          // Initialize Controller
          ServicesController = $controller('ServicesController as vm', {
            $scope: $scope,
            serviceResolve: mockService
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.serviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/services/create');
        }));

        it('should attach an Service to the controller scope', function () {
          expect($scope.vm.service._id).toBe(mockService._id);
          expect($scope.vm.service._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/services/client/views/form-service.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ServicesController,
          mockService;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('services.edit');
          $templateCache.put('modules/services/client/views/form-service.client.view.html', '');

          // create mock Service
          mockService = new ServicesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Service Name'
          });

          // Initialize Controller
          ServicesController = $controller('ServicesController as vm', {
            $scope: $scope,
            serviceResolve: mockService
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:serviceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.serviceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            serviceId: 1
          })).toEqual('/services/1/edit');
        }));

        it('should attach an Service to the controller scope', function () {
          expect($scope.vm.service._id).toBe(mockService._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/services/client/views/form-service.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
