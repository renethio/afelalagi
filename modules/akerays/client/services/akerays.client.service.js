// Akerays service used to communicate Akerays REST endpoints
(function () {
  'use strict';

  angular
    .module('akerays')
    .factory('AkeraysService', AkeraysService);

  AkeraysService.$inject = ['$resource'];

  function AkeraysService($resource) {
    return $resource('api/akerays/:akerayId', {
      akerayId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
