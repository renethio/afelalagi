// Services service used to communicate Services REST endpoints
(function () {
  'use strict';

  angular
    .module('services')
    .factory('ServicesService', ServicesService);

  ServicesService.$inject = ['$resource'];

  function ServicesService($resource) {
    return $resource('api/services/:serviceId', {
      serviceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
