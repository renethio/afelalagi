(function () {
  'use strict';

  angular
    .module('akerays')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('akerays', {
        abstract: true,
        url: '/akerays',
        template: '<ui-view/>'
      })
      .state('akerays.list', {
        url: '',
        templateUrl: 'modules/akerays/client/views/list-akerays.client.view.html',
        controller: 'AkeraysListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Akerays List'
        }
      })
      .state('akerays.create', {
        url: '/create',
        templateUrl: 'modules/akerays/client/views/form-akeray.client.view.html',
        controller: 'AkeraysController',
        controllerAs: 'vm',
        resolve: {
          akerayResolve: newAkeray
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Akerays Create'
        }
      })
      .state('akerays.edit', {
        url: '/:akerayId/edit',
        templateUrl: 'modules/akerays/client/views/form-akeray.client.view.html',
        controller: 'AkeraysController',
        controllerAs: 'vm',
        resolve: {
          akerayResolve: getAkeray
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Akeray {{ akerayResolve.name }}'
        }
      })
      .state('akerays.view', {
        url: '/:akerayId',
        templateUrl: 'modules/akerays/client/views/view-akeray.client.view.html',
        controller: 'AkeraysController',
        controllerAs: 'vm',
        resolve: {
          akerayResolve: getAkeray
        },
        data: {
          pageTitle: 'Akeray {{ akerayResolve.name }}'
        }
      });
  }

  getAkeray.$inject = ['$stateParams', 'AkeraysService'];

  function getAkeray($stateParams, AkeraysService) {
    return AkeraysService.get({
      akerayId: $stateParams.akerayId
    }).$promise;
  }

  newAkeray.$inject = ['AkeraysService'];

  function newAkeray(AkeraysService) {
    return new AkeraysService();
  }
}());
