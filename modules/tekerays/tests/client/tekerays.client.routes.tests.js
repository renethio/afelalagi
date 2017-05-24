(function () {
  'use strict';

  describe('Tekerays Route Tests', function () {
    // Initialize global variables
    var $scope,
      TekeraysService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TekeraysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TekeraysService = _TekeraysService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tekerays');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tekerays');
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
          TekeraysController,
          mockTekeray;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tekerays.view');
          $templateCache.put('modules/tekerays/client/views/view-tekeray.client.view.html', '');

          // create mock Tekeray
          mockTekeray = new TekeraysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tekeray Name'
          });

          // Initialize Controller
          TekeraysController = $controller('TekeraysController as vm', {
            $scope: $scope,
            tekerayResolve: mockTekeray
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tekerayId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tekerayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tekerayId: 1
          })).toEqual('/tekerays/1');
        }));

        it('should attach an Tekeray to the controller scope', function () {
          expect($scope.vm.tekeray._id).toBe(mockTekeray._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tekerays/client/views/view-tekeray.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TekeraysController,
          mockTekeray;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tekerays.create');
          $templateCache.put('modules/tekerays/client/views/form-tekeray.client.view.html', '');

          // create mock Tekeray
          mockTekeray = new TekeraysService();

          // Initialize Controller
          TekeraysController = $controller('TekeraysController as vm', {
            $scope: $scope,
            tekerayResolve: mockTekeray
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tekerayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tekerays/create');
        }));

        it('should attach an Tekeray to the controller scope', function () {
          expect($scope.vm.tekeray._id).toBe(mockTekeray._id);
          expect($scope.vm.tekeray._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tekerays/client/views/form-tekeray.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TekeraysController,
          mockTekeray;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tekerays.edit');
          $templateCache.put('modules/tekerays/client/views/form-tekeray.client.view.html', '');

          // create mock Tekeray
          mockTekeray = new TekeraysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tekeray Name'
          });

          // Initialize Controller
          TekeraysController = $controller('TekeraysController as vm', {
            $scope: $scope,
            tekerayResolve: mockTekeray
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tekerayId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tekerayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tekerayId: 1
          })).toEqual('/tekerays/1/edit');
        }));

        it('should attach an Tekeray to the controller scope', function () {
          expect($scope.vm.tekeray._id).toBe(mockTekeray._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tekerays/client/views/form-tekeray.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
