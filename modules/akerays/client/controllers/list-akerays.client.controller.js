(function () {
  'use strict';

  angular
    .module('akerays')
    .controller('AkeraysListController', AkeraysListController);

  AkeraysListController.$inject = ['AkeraysService'];

  function AkeraysListController(AkeraysService) {
    var vm = this;

    vm.akerays = AkeraysService.query();
  }
}());
