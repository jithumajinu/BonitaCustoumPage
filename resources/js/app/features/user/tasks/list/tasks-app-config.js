(function() {
  'use strict';
  /**
   * module that contains taskapp API related config
   */
   angular.module('dateFormatter', []).filter('customDate', function($filter){
       var standardDateFilterFn = $filter('date');
       return function(dateToFormat,pattern){
           if(!dateToFormat)
              return "";
           var date = new Date(dateToFormat);
           return standardDateFilterFn(date, pattern);
       };
   });

        var errorMsgreqLen = "Required and length lessthan 3";
        var errorMsgreqLen3 = "Required and length lessthan 4";

  angular
    .module('org.bonitasoft.features.user.tasks.app.config', ['org.bonitasoft.common.resources'])
  /**
   * TASK_FILTERS associates API ressource with predifined filters parameters.
   * @see taskapp.TaskFilters
   * @return {Object}
   */
  .service('TASK_FILTERS',['actorAPI','masterTaskAPI',function(actorAPI,masterTaskAPI) {
        var taskFilterAPI = {};
        taskFilterAPI.getData = function(tableName) {
               // write code here
        };
        return taskFilterAPI;
    }])
  /**
   * DEFAULT_DETAILS
   * @type {String}
   * @constant use to show context task
   */
  .constant('DEFAULT_DETAILS', true)
  /**
   * max : default visible task fields id for list only view
   * mid: default visible task fields id for list + details view
   * min: default visible task fields id for phone view  (max 991px)
   */
  .constant('COLUMNS_SETTINGS', {
    'min': [
      false, //'id'
      true, //'displayName'
      false, //'displayDescription'
      true, //'caseId'
      false, //'rootContainerId.name'
      false, //'last_update_date'
      false, //'assigned_date'
      true, //'dueDate'
      false //'priority'
    ],
    'mid': [
      false, //'id'
      true, //'displayName'
      false, //'displayDescription'
      false, //'caseId'
      true, //'rootContainerId.name'
      false, //'last_update_date'
      false, //'assigned_date'
      true, //'dueDate'
      false //'priority'
    ],
    'max': [
      true, //'id',
      true, //'displayName',
      false, //'displayDescription',
      true, //'caseId,
      true, //'rootContainerId.name',
      true, //'last_update_date',
      false, //'assigned_date',
      true, //'dueDate',
      false //'priority',
    ]
  });

})();
