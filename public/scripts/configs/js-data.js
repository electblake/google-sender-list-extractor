angular.module('addressBundlerConfig')
  .config(['DSProvider', function (DSProvider) {
    DSProvider.defaults.basePath = '/api'; // etc.
  }]);