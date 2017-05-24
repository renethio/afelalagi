(function () {
  'use strict';

  angular
    .module('tekerays')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tekerays', {
        abstract: true,
        url: '/tekerays',
        template: '<ui-view/>'
      })
      .state('tekerays.list', {
        url: '',
        templateUrl: 'modules/tekerays/client/views/list-tekerays.client.view.html',
        controller: 'TekeraysListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tekerays List'
        }
      })
      .state('tekerays.create', {
        url: '/create',
        templateUrl: 'modules/tekerays/client/views/form-tekeray.client.view.html',
        controller: 'TekeraysController',
        controllerAs: 'vm',
        resolve: {
          tekerayResolve: newTekeray
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tekerays Create'
        }
      })
      .state('tekerays.edit', {
        url: '/:tekerayId/edit',
        templateUrl: 'modules/tekerays/client/views/form-tekeray.client.view.html',
        controller: 'TekeraysController',
        controllerAs: 'vm',
        resolve: {
          tekerayResolve: getTekeray
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tekeray {{ tekerayResolve.name }}'
        }
      })
      .state('tekerays.view', {
        url: '/:tekerayId',
        templateUrl: 'modules/tekerays/client/views/view-tekeray.client.view.html',
        controller: 'TekeraysController',
        controllerAs: 'vm',
        resolve: {
          tekerayResolve: getTekeray
        },
        data: {
          pageTitle: 'Tekeray {{ tekerayResolve.name }}'
        }
      });
  }

  getTekeray.$inject = ['$stateParams', 'TekeraysService'];

  function getTekeray($stateParams, TekeraysService) {
    return TekeraysService.get({
      tekerayId: $stateParams.tekerayId
    }).$promise;
  }

  newTekeray.$inject = ['TekeraysService'];

  function newTekeray(TekeraysService) {
    return new TekeraysService();
  }
}());
