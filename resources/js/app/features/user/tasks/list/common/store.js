(function() {
  'use strict';

  /**
   * Substitute User application Store
   *
   * the store handles application state.
   * store makes request to bonita API and stores the result.
   */
  angular
    .module('org.bonitasoft.features.user.tasks.app.store', [
      'api.request',
      'org.bonitasoft.features.user.tasks.app.config',
      'gettext'
    ])
    .service('showAlertSrvc', function ($timeout) {
      return function(delay) {
        	   var result = {hidden:true};
        	   $timeout(function() {
        	       result.hidden=false;
        	   }, delay);
        	   return result;
        	   };
    })

    .factory('SubstituteUserAPI', function ($resource,$http) {
        var substituteUserAPI = {};
        substituteUserAPI.getBonitaSession = function() {
	              return $http.get('../../../API/system/session/1');
	      };
        return substituteUserAPI;

    })

    .service('taskListStore', [
      function(){
        var store = this;
        this.user = null;
      }
    ]);
})();
