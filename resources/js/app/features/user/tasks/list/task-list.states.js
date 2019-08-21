(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list')
    .config(substituteUserRoutes);

  function substituteUserRoutes($stateProvider) {

    $stateProvider
      .state('bonita.substituteUser', {
        templateUrl: 'templateview/process-changepolicy.html'
      });
  }

})();
// templateUrl: 'templateview/substitute-user.html'
//   templateUrl: 'portalTemplates/user/tasks/list/substitute-user.html'
