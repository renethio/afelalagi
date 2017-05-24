(function () {
  'use strict';

  describe('Akerays Route Tests', function () {
    // Initialize global variables
    var $scope,
      AkeraysService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AkeraysService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AkeraysService = _AkeraysService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('akerays');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/akerays');
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
          AkeraysController,
          mockAkeray;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('akerays.view');
          $templateCache.put('modules/akerays/client/views/view-akeray.client.view.html', '');

          // create mock Akeray
          mockAkeray = new AkeraysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Akeray Name'
          });

          // Initialize Controller
          AkeraysController = $controller('AkeraysController as vm', {
            $scope: $scope,
            akerayResolve: mockAkeray
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:akerayId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.akerayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            akerayId: 1
          })).toEqual('/akerays/1');
        }));

        it('should attach an Akeray to the controller scope', function () {
          expect($scope.vm.akeray._id).toBe(mockAkeray._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/akerays/client/views/view-akeray.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AkeraysController,
          mockAkeray;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('akerays.create');
          $templateCache.put('modules/akerays/client/views/form-akeray.client.view.html', '');

          // create mock Akeray
          mockAkeray = new AkeraysService();

          // Initialize Controller
          AkeraysController = $controller('AkeraysController as vm', {
            $scope: $scope,
            akerayResolve: mockAkeray
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.akerayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/akerays/create');
        }));

        it('should attach an Akeray to the controller scope', function () {
          expect($scope.vm.akeray._id).toBe(mockAkeray._id);
          expect($scope.vm.akeray._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/akerays/client/views/form-akeray.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AkeraysController,
          mockAkeray;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('akerays.edit');
          $templateCache.put('modules/akerays/client/views/form-akeray.client.view.html', '');

          // create mock Akeray
          mockAkeray = new AkeraysService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Akeray Name'
          });

          // Initialize Controller
          AkeraysController = $controller('AkeraysController as vm', {
            $scope: $scope,
            akerayResolve: mockAkeray
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:akerayId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.akerayResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            akerayId: 1
          })).toEqual('/akerays/1/edit');
        }));

        it('should attach an Akeray to the controller scope', function () {
          expect($scope.vm.akeray._id).toBe(mockAkeray._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/akerays/client/views/form-akeray.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
