(function () {
  'use strict';

  // Services controller
  angular
    .module('services')
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'serviceResolve'];

  function ServicesController ($scope, $state, $window, Authentication, service) {
    var vm = this;

    vm.authentication = Authentication;
    vm.service = service;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Service
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.service.$remove($state.go('services.list'));
      }
    }

    // Save Service
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.serviceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.service._id) {
        vm.service.$update(successCallback, errorCallback);
      } else {
        vm.service.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('services.view', {
          serviceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
