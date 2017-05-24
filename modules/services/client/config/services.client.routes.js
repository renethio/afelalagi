(function () {
  'use strict';

  angular
    .module('services')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('services', {
        abstract: true,
        url: '/services',
        template: '<ui-view/>'
      })
      .state('services.list', {
        url: '',
        templateUrl: 'modules/services/client/views/list-services.client.view.html',
        controller: 'ServicesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Services List'
        }
      })
      .state('services.create', {
        url: '/create',
        templateUrl: 'modules/services/client/views/form-service.client.view.html',
        controller: 'ServicesController',
        controllerAs: 'vm',
        resolve: {
          serviceResolve: newService
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Services Create'
        }
      })
      .state('services.edit', {
        url: '/:serviceId/edit',
        templateUrl: 'modules/services/client/views/form-service.client.view.html',
        controller: 'ServicesController',
        controllerAs: 'vm',
        resolve: {
          serviceResolve: getService
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Service {{ serviceResolve.name }}'
        }
      })
      .state('services.view', {
        url: '/:serviceId',
        templateUrl: 'modules/services/client/views/view-service.client.view.html',
        controller: 'ServicesController',
        controllerAs: 'vm',
        resolve: {
          serviceResolve: getService
        },
        data: {
          pageTitle: 'Service {{ serviceResolve.name }}'
        }
      });
  }

  getService.$inject = ['$stateParams', 'ServicesService'];

  function getService($stateParams, ServicesService) {
    return ServicesService.get({
      serviceId: $stateParams.serviceId
    }).$promise;
  }

  newService.$inject = ['ServicesService'];

  function newService(ServicesService) {
    return new ServicesService();
  }
}());
