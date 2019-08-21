(function() {
    'use strict';
    /**
     * This module hold the main application
     */
    angular
        .module('org.bonitasoft.features.user.tasks.app', [
            'ui.bootstrap',
            'api.request',
            'org.bonitasoft.features.user.tasks.ui.iframe.spy',
            'common.screen',
            'common.iframe',
            'ui.bootstrap.modal',
            'ngTouch',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.cellNav',
            'ui.grid.edit',
            'ui.grid.rowEdit',
            'ui.grid.resizeColumns',
            'ui.grid.pinning',
            'ui.grid.selection',
            'ui.grid.moveColumns',
            'ui.grid.exporter',
            'ui.grid.grouping',
            'dateFormatter',
            'ui.grid.validate',
            'ui.grid.autoFitColumns',
            'ngMessages',
        ])
        /*.config(function($provide){
                        $provide.decorator('GridOptions',function($delegate){
                         var gridOptions;
                             gridOptions = angular.copy($delegate);
                             gridOptions.initialize = function(options) {
                             var initOptions;
                             initOptions = $delegate.initialize(options);
                             initOptions.enableColumnMenus = false;
                             return initOptions;
                             };
                         return gridOptions;
                       });
              })*/
        /**
         * Controller for Substitute-app diretive
         */
        .controller('SubstituteAppCtrl',
            function(
                $scope,
                $window,
                $http,
                $log,
                $parse,
                $filter,
                taskListStore,
                sessionAPI,
                screen,
                iframe,
                preference,
                showAlertSrvc,
                SubstituteUserAPI,
                TASK_FILTERS,
                $q,
                $timeout,
                $interval,
                uiGridConstants,
                uiGridGroupingConstants,
                $compile,
                masterTaskAPI
            ) {

                var vm = this;
                /**
                 * Method : init
                 */
                this.init = function() {

                    var store = taskListStore;
                    $scope.timeoutdelay = 5000; // milli sec
                    $scope.selectedCasePopUp = "inputForm_id_forPOPUP";
                    $scope.selectedCase      = {};
                    $scope.isInEditMode = false;

                    $scope.alertSucces = "col-sm-8 alert alert-success";
                    $scope.alertDanger = "col-sm-8 alert alert-danger";
                    $scope.isImport = false;
                    this.smallScreen = screen.size.name === 'sm';
                    this.showMenu = preference.get('showFilters');
                    this.expandDetails = false;
                    $scope.alrtMsg = {
                        hidden: false
                    };
                    this.getMode = preference.getMode;
                    $scope.$log = $log;
                    $scope.getSessionTocken();
                    store.user = sessionAPI.get({
                        id: 'unusedId'
                    });
                    store.user.$promise.then(function() {
                        $scope.user = store.user;
                    }.bind(this));
                    //  call set table
                    $scope.gridHeight = (( 10 * 40)+112)+'px';
                    $scope.getTableList();
                    /*
                    $scope.processChangePolicyProcessList = [];
                    var promise = masterTaskAPI.getProcessChangePolicyProcessList();
                    promise.then(function(payload) {
                     $scope.processChangePolicyProcessList = payload.data
                     if($scope.processChangePolicyProcessList.length!=0){
                      // $scope.selectedOption  = $scope.processChangePolicyProcessList[0].processName;
                      // $scope.setStatusTaskFilter($scope.processChangePolicyProcessList[0]);
                     }

                    }, function(errorPayload) {
                        $log.error(errorPayload);
                    });

                     */

                }; // init close



                $scope.toggleEditMode = function(mode, eitRow) {
                    $scope.isInEditMode = !$scope.isInEditMode;
                    if ($scope.isInEditMode) {
                       $scope.selectedCase =  eitRow;
                       $scope.getCaseOverView($scope.selectedCase);

                    }
                };


                $scope.getCaseOverView = function(selectedCase) {
                  var caseId =selectedCase.caseId;
                masterTaskAPI.listDoneTasks(caseId).then(function mapArchivedTasks(result) {
                    $scope.doneTasks = result.data;
                });
              /*  masterTaskAPI.timeLineTasks(caseId).then(function mapArchivedTasks(result) {
                    $scope.timeLineTasks = result.data;
                });
                masterTaskAPI.failedTasks(caseId).then(function (result) {
                     $scope.failedTasks = result.data;
                });
                masterTaskAPI.commentsData(caseId).then(function (result) {
                     $scope.commentsData = result.data;
                });
                masterTaskAPI.caseDocuments(caseId).then(function (result) {
                     $scope.caseDocuments = result.data;
                });
                */
                };

                $scope.setStatusTaskFilter = function(option) {
                  $scope.selectedOption  = option.processName;
                   $scope.getTableList(option);
                };

                $scope.migrateRow = function() {
                     var toMigrateDataRows = [];
                    angular.forEach($scope.gridApi.selection.getSelectedGridRows(), function(data, index) {
                       toMigrateDataRows.push(data.entity);
                    });
                  $scope.loadingTaskList = true;
                   var promise = masterTaskAPI.migrateDataEntry(toMigrateDataRows,$scope.user);
                   promise.then(function(payload) {
                       if (payload.data.status === "Success")
                            $scope.messageClass = "alert alert-success";
                       else if (payload.data.status === "fail")
                            $scope.messageClass = "alert alert-danger";

                        $scope.gridApi.selection.clearSelectedRows();
                        $scope.getTableList();
                        $scope.alertMessage = payload.data.message;
                        $scope.alrtMsg = showAlertSrvc($scope.timeoutdelay);
                        $scope.loadingTaskList = false;
                   }, function(errorPayload) {
                         $log.error(errorPayload);
                         $scope.messageClass = "alert alert-danger";
                         $scope.loadingTaskList = false;
                         $scope.alertMessage = errorPayload.data.error;
                         $scope.alrtMsg = showAlertSrvc($scope.timeoutdelay);
                   });


                };

                Array.prototype.contains = function contains(obj) {
                       for (var i = 0; i < this.length; i++) {
                           if (parseInt(this[i]) ===  parseInt(obj) ) {
                             return true;
                           }
                       }
                     return false;
                };

                $scope.getTableList = function() {

                    $scope.loadingTaskList = true;
                    var promise = masterTaskAPI.getMigrationEntryList();
                    promise.then(function(payload) {
                        $scope.gridOptions.data = payload.data;
                        $scope.loadingTaskList = false;
                    }, function(errorPayload) {
                        $log.error(errorPayload);
                        $scope.loadingTaskList = false;
                    });
                };

              //  var editableCellTemplateTextArea = "<div><form name=\"inputForm\">     <textarea rows=\"3\" cols=\"40\"  ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\"  > </textarea>        <div ng-show=\"!inputForm.$valid\"><span class=\"error\"><!--Enter Name--></span></div></form></div>"


                $scope.gridOptions = {
                    paginationPageSizes: [10, 20, 30],
                    rowHeight: 40,
                    paginationPageSize: 10,
                    rowEditWaitInterval: -1,
                    enableColumnResizing: true,
                    enableFiltering: true,
                    fastWatch: true,
                    enableCellEdit: false,
                    enableGridMenu: true,
                    enableSelectAll: true,
                    enableRowSelection: true,
                    isRowSelectable: function(row) {
                     if(row.entity.disabled === true) return false;
                      return true; //everyone else is
                     },
                    multiSelect: true,
                    gridMenuShowHideColumns: false,
                    rowStyle: function(row){
                     if(row.entity.execFlag === true){ return 'red'; }
                     else{ return 'green'; }
                    },
                    rowTemplate : "<div ng-class=\"grid.options.rowStyle(row)\"><div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.uid\" ui-grid-one-bind-id-grid=\"rowRenderIndex + '-' + col.uid + '-cell'\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader}\" class=\"ui-grid-cell\" role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\" ui-grid-cell></div></div>"
            };

                var   headerCellTemplateVar = '<div><div class="ui-grid-vertical-bar">&nbsp;</div><div class="ui-grid-cell-contents" ><span>{{ col.displayName | translate }}</span><span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }">&nbsp;</span></div><div class="ui-grid-column-menu-button" ng-if="grid.options.enableColumnMenus &&' + '!col.isRowHeader  && col.colDef.enableColumnMenu !== false" class="ui-grid-column-menu-button" ng-click="toggleMenu($event)"><i class="ui-grid-icon-angle-down">&nbsp;</i></div><div ng-if="filterable" class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><input type="text" class="ui-grid-filter-input" ng-model="colFilter.term" ng-click="$event.stopPropagation()"  /><div class="ui-grid-filter-button" ng-click="colFilter.term = null"> ' +
                                    '<i class="ui-grid-icon-cancel" ng-show="!!colFilter.term">&nbsp;</i> </div></div></div>'
                var editableCellTemplateVar = "<div><form name=\"inputForm\"><input type=\"INPUT_TYPE\" ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\"  minlength=1  required><div ng-show=\"!inputForm.$valid\"><span class=\"error\"><!--Enter Name--></span></div></form></div>"

                $scope.gridOptions.columnDefs = [
                  {
                      displayName:'Actions',
                      name: 'Actions',
                      enableFiltering: false,
                      headerCellTemplate: headerCellTemplateVar,
                      cellTemplate: ' <div class="ui-grid-cell-contents" ng-click="grid.appScope.toggleEditMode(true,row.entity)"> &nbsp  <i   class="glyphicon glyphicon-list clickable" > </i>  </div>'
                  },
                       {
                          displayName:'Case Id',
                          field:'caseId',
                          headerCellTemplate:headerCellTemplateVar,
                      },{
                        displayName: 'Process name',
                        field: 'processName',
                        headerCellTemplate:headerCellTemplateVar
                      },{
                        displayName: 'Process Id',
                        field: 'processId',
                        headerCellTemplate:headerCellTemplateVar
                      },{
                        displayName: 'Execute',
                        field: 'execFlag',
                        headerCellTemplate:headerCellTemplateVar,
                      //  cellTemplate: '<div class="ui-grid-cell-contents"><span class="glyphicon glyphicon-ok"> </span></div>'
                      },
                      {
                        displayName: 'Start date',
                        field: 'startDate',
                        width:150,
                        type:'date',
                        headerCellTemplate:headerCellTemplateVar,
                        cellTemplate: ' <div class="ui-grid-cell-contents"> <span> {{  grid.appScope.getFormatedDate(row.entity.startDate) | date:"yyyy/MM/dd" }}</span> </div>'
                        //cellTemplate: "<div class='ngCellText'>{{row.entity.start | date:'MM/dd/yy h:mm:ss a'}}</div>" ,
                      },{
                        displayName: 'Started by',
                        field: 'startedBy',
                        headerCellTemplate:headerCellTemplateVar,
                        cellTemplate: '<div class="ui-grid-cell-contents"><span>{{ (row.entity.startedBy ==null)?"System":row.entity.startedBy }}</span></div>'
                      },{
                        displayName: 'Search Key 1',
                        field: 'searchKey1',
                        headerCellTemplate:headerCellTemplateVar
                      },{
                        displayName: 'Search Key 2',
                        field: 'searchKey2',
                        headerCellTemplate:headerCellTemplateVar
                      },{
                        displayName: 'Search Key 3',
                        field: 'searchKey3',
                        headerCellTemplate:headerCellTemplateVar
                      },{
                        displayName: 'Search Key 4',
                        field: 'searchKey4',
                        headerCellTemplate:headerCellTemplateVar
                      },{
                        displayName: 'Search Key 5',
                        field: 'searchKey5',
                        headerCellTemplate:headerCellTemplateVar
                      }


                ];

            /*    $scope.filterGrid = function() {
                //  console.log($scope.gridApi);
                //  $scope.gridApi.grid.columns[2].filters[0].term=value;
                };
            */
                $scope.gridOptions.onRegisterApi = function(gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function() {
                        $scope.setUiGridHeight();
                    })


                /*   gridApi.selection.on.rowSelectionChanged($scope, function(row){
                        var msg = 'row selected ' + row.isSelected;
                        console.log(msg);
                     });

                   gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
                      var msg = 'rows changed ' + rows.length;
                       console.log(msg);
                    });
                  */

                };

                $scope.gridOptions.exporterFieldCallback = function (grid, row, col, value) {
                if (col.name === 'start') {
                     value = toJSONLocal(dateFromISO8601(value)) ;
                }/* else if(col.name === 'started_by.firstname'){
                     value =  row.entity.started_by.lastname;
                }*/
                return value;
                }


                function dateFromISO8601(isoDateString) {
                                   var parts = isoDateString.match(/\d+/g);
                                   var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
                                   var isoDate = new Date(isoTime);
                                return isoDate;
                }

                function parseAndFormat(a){
                 return (a.replace(/ /,"T"))
                }

                function dateFromISO8601ToString(isoDateString) {
                                   var parts = isoDateString.match(/\d+/g);
                                   var isoTime = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
                                   var isoDate = new Date(isoTime);
                                return isoDate.toLocaleDateString();
                }

                /**
                 Method :  getFormatedDate
                 param :
                */
                $scope.getFormatedDate = function(dateString) {
                    return dateFromISO8601(dateString);
                };

                function toJSONLocal (date) {
	              var local = new Date(date);
	              local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	              return local.toJSON().slice(0, 10);
               }



                $scope.setUiGridHeight = function() {
                    var paginationPageSize = $scope.gridOptions.paginationPageSize;
                    var rowHeight = 44;
                    if ($scope.gridOptions.data.length < paginationPageSize) {
                        if ($scope.gridOptions.data.length < 10) {
                            paginationPageSize = 10;
                        } else {
                            paginationPageSize = $scope.gridOptions.data.length;
                        }
                    }
                    $scope.gridHeight = ((paginationPageSize * rowHeight) + 112) + 'px';
                    $scope.gridApi.grid.gridHeight = (paginationPageSize * rowHeight) + 112;
                    $scope.gridApi.core.refresh();
                }

                // Method : isDelete Button enable
                $scope.hasSelectedGridRows = function() {
                    return ($scope.gridApi.selection.getSelectedGridRows().length > 0) ? false : true
                }

                $scope.toggleMultiSelect = function() {
                    $scope.gridApi.selection.setMultiSelect(!$scope.gridApi.grid.options.multiSelect);
                };

                $scope.toggleModifierKeysToMultiSelect = function() {
                    $scope.gridApi.selection.setModifierKeysToMultiSelect(!$scope.gridApi.grid.options.modifierKeysToMultiSelect);
                };

                $scope.selectAll = function() {
                    $scope.gridApi.selection.selectAllRows();
                };

                $scope.clearAll = function() {
                    $scope.gridApi.selection.clearSelectedRows();
                };

                /**
                 Method :  getSessionTocken
                 param :
                */
                $scope.getSessionTocken = function() {
                    var promise = SubstituteUserAPI.getBonitaSession();
                    promise.then(function(payload) {
                            $scope.apiToken = payload.headers('X-Bonita-API-Token');
                        },
                        function(errorPayload) {
                            $log.error(errorPayload);
                        });
                };

                this.onScreenChange = function() {
                    this.smallScreen = screen.size.name === 'sm' || screen.size.name === 'xs';
                };
                screen.on(this.onScreenChange.bind(this));
                this.toggleFilters = function() {
                    this.showMenu = !this.showMenu;
                    preference.set('showFilters', this.showMenu);
                };
            }
        )


        /**
         * task-app directive (Main app directive)
         */
        .directive('substituteApp', function() {
            return {
                controller: 'SubstituteAppCtrl',
                controllerAs: 'app',
                restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                link: function($scope, iElm, iAttrs, controller) {
                    controller.init();
                }
            };
        })
        .directive('confirmClick', ['$q', 'dialogModal', function($q, dialogModal) {
            return {
                link: function(scope, element, attrs) {
                    // ngClick won't wait for our modal confirmation window to resolve,
                    // so we will grab the other values in the ngClick attribute, which
                    // will continue after the modal resolves.
                    // modify the confirmClick() action so we don't perform it again
                    // looks for either confirmClick() or confirmClick('are you sure?')
                    var ngClick = attrs.ngClick.replace('confirmClick()', 'true')
                        .replace('confirmClick(', 'confirmClick(true,');

                    // setup a confirmation action on the scope
                    scope.confirmClick = function(msg, title) {

                        // if the msg was set to true, then return it (this is a workaround to make our dialog work)
                        if (msg === true) {
                            return true;
                        }
                        // msg can be passed directly to confirmClick('are you sure?') in ng-click
                        // or through the confirm-click attribute on the <a confirm-click="Are you sure?"></a>
                        msg = msg || attrs.confirmClick || msg;
                        // open a dialog modal, and then continue ngClick actions if it's confirmed
                        dialogModal(msg, title).result.then(function() {
                            scope.$eval(ngClick);
                        });
                        // return false to stop the current ng-click flow and wait for our modal answer
                        return false;
                    };
                }
            }
        }])

        .directive('confirmClickIm', ['$q', 'dialogModal', function($q, dialogModal) {
            return {
                link: function(scope, element, attrs) {
                    // ngClick won't wait for our modal confirmation window to resolve,
                    // so we will grab the other values in the ngClick attribute, which
                    // will continue after the modal resolves.
                    // modify the confirmClick() action so we don't perform it again
                    // looks for either confirmClick() or confirmClick('are you sure?')
                    var ngClick = attrs.ngClick.replace('confirmClick()', 'true')
                        .replace('confirmClickIm(', 'confirmClickIm(true,');

                    // setup a confirmation action on the scope
                    scope.confirmClickIm = function(msg, title) {
                        // if the msg was set to true, then return it (this is a workaround to make our dialog work)
                        if (msg === true) {
                            return true;
                        }
                        // msg can be passed directly to confirmClick('are you sure?') in ng-click
                        // or through the confirm-click attribute on the <a confirm-click="Are you sure?"></a>
                        msg = msg || attrs.confirmClickIm || msg;
                        // open a dialog modal, and then continue ngClick actions if it's confirmed
                        dialogModal(msg, title).result.then(function() {
                            scope.$eval(ngClick);
                        });
                        // return false to stop the current ng-click flow and wait for our modal answer
                        return false;
                    };
                }
            }
        }])

        .directive('confirmClickUp', ['$q', 'dialogModal', function($q, dialogModal) {
            return {
                link: function(scope, element, attrs) {
                    // ngClick won't wait for our modal confirmation window to resolve,
                    // so we will grab the other values in the ngClick attribute, which
                    // will continue after the modal resolves.
                    // modify the confirmClick() action so we don't perform it again
                    // looks for either confirmClick() or confirmClick('are you sure?')
                    var ngClick = attrs.ngClick.replace('confirmClick()', 'true')
                        .replace('confirmClickUp(', 'confirmClickUp(true,');

                    // setup a confirmation action on the scope
                    scope.confirmClickUp = function(msg, title) {
                        // if the msg was set to true, then return it (this is a workaround to make our dialog work)
                        if (msg === true) {
                            return true;
                        }
                        // msg can be passed directly to confirmClick('are you sure?') in ng-click
                        // or through the confirm-click attribute on the <a confirm-click="Are you sure?"></a>
                        msg = msg || attrs.confirmClickUp || msg;
                        // open a dialog modal, and then continue ngClick actions if it's confirmed
                        dialogModal(msg, title).result.then(function() {
                            scope.$eval(ngClick);
                        });
                        // return false to stop the current ng-click flow and wait for our modal answer
                        return false;
                    };
                }
            }
        }])

        .filter('unsafe', ['$sce', function($sce) {
            return function(val) {
                return $sce.trustAsHtml(val);
            };
        }])
        .service('dialogModal', ['$modal', function($modal) {
            return function(message, title, okButton, cancelButton) {
                // setup default values for buttons
                // if a button value is set to false, then that button won't be included
                okButton = okButton === false ? false : (okButton || 'Yes');
                cancelButton = cancelButton === false ? false : (cancelButton || 'No');

                // setup the Controller to watch the click
                var ModalInstanceCtrl = function($scope, $modalInstance, settings) {
                    // add settings to scope
                    angular.extend($scope, settings);
                    //  $scope.modalTitle = "Confirmation!";
                    // ok button clicked
                    $scope.ok = function() {

                        $modalInstance.close(true);

                    };
                    // cancel button clicked
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                };

                // open modal and return the instance (which will resolve the promise on ok/cancel clicks)
                var modalInstance = $modal.open({
                    template: '<div class="dialog-modal"> \
                <div class="modal-header" ng-show="modalTitle"> \
                    <h4 class="modal-title"> {{modalTitle | translate}}</h4> \
                </div> \
                <div class="modal-body"> {{modalBody | translate}}</div> \
                <div class="modal-footer"> \
                    <button class="btn btn-warning" ng-click="cancel()" ng-show="cancelButton">{{cancelButton | translate}}</button> \
                          <button class="btn btn-primary" ng-click="ok()" ng-show="okButton">{{okButton | translate}}</button> \
                </div> \
            </div>',
                    controller: ModalInstanceCtrl,
                    resolve: {
                        settings: function() {
                            return {
                                modalTitle: title,
                                modalBody: message,
                                okButton: okButton,
                                cancelButton: cancelButton
                            };
                        }
                    }
                });
                // return the modal instance
                return modalInstance;
            }
        }])
        .directive('myModal', function() {
            return {
                restrict: 'A',
                scope: {
                    myModalIsOpen: '='
                },
                link: function(scope, element, attr) {
                    scope.$watch(
                        function() {
                            return scope.myModalIsOpen;
                        },
                        function() {
                            element.modal(scope.myModalIsOpen ? 'show' : 'hide');
                        }
                    );
                }
            }
        });
})();
