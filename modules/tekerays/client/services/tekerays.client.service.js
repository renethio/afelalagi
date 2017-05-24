// Tekerays service used to communicate Tekerays REST endpoints
(function () {
  'use strict';

  angular
    .module('tekerays')
    .factory('TekeraysService', TekeraysService);

  TekeraysService.$inject = ['$resource'];

  function TekeraysService($resource) {
    return $resource('api/tekerays/:tekerayId', {
      tekerayId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
