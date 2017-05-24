(function () {
  'use strict';

  angular
    .module('tekerays')
    .controller('TekeraysListController', TekeraysListController);

  TekeraysListController.$inject = ['TekeraysService'];

  function TekeraysListController(TekeraysService) {
    var vm = this;

    vm.tekerays = TekeraysService.query();
  }
}());
