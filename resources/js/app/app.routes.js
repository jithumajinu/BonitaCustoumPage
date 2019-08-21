(function() {

  'use strict';

  angular
    .module('org.bonitasoft.portal')
    .config(routes);

  function routes($urlRouterProvider) {
    // redirect to bonita.substituteUser when context is /
    $urlRouterProvider.when('', function($state) {
      $state.go('bonita.substituteUser')
    })
  }

})();
