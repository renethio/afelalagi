(function () {
  'use strict';

  // Akerays controller
  angular
    .module('akerays')
    .controller('AkeraysController', AkeraysController);

  AkeraysController.$inject = ['$scope', '$state', '$window', 'Authentication', 'akerayResolve'];

  function AkeraysController ($scope, $state, $window, Authentication, akeray) {
    var vm = this;

    vm.authentication = Authentication;
    vm.akeray = akeray;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Akeray
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.akeray.$remove($state.go('akerays.list'));
      }
    }

    // Save Akeray
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.akerayForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.akeray._id) {
        vm.akeray.$update(successCallback, errorCallback);
      } else {
        vm.akeray.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('akerays.view', {
          akerayId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
