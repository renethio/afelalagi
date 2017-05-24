(function () {
  'use strict';

  // Tekerays controller
  angular
    .module('tekerays')
    .controller('TekeraysController', TekeraysController);

  TekeraysController.$inject = ['$scope', '$state', '$window', 'Authentication', 'tekerayResolve'];

  function TekeraysController ($scope, $state, $window, Authentication, tekeray) {
    var vm = this;

    vm.authentication = Authentication;
    vm.tekeray = tekeray;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tekeray
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tekeray.$remove($state.go('tekerays.list'));
      }
    }

    // Save Tekeray
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tekerayForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.tekeray._id) {
        vm.tekeray.$update(successCallback, errorCallback);
      } else {
        vm.tekeray.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tekerays.view', {
          tekerayId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
