(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('customEditionContainer', function() {
    return {
      controllerAs: 'ctrl',
      controller: /**
 * The controller is a JavaScript function that augments the AngularJS scope and exposes functions that can be used in the custom widget template
 * 
 * Custom widget properties defined on the right can be used as variables in a controller with $scope.properties
 * To use AngularJS standard services, you must declare them in the main function arguments.
 * 
 * You can leave the controller empty if you do not need it.
 */
function($scope, $parse, widgetNameFactory, $log, $filter) {

    'use strict';
    var ctrl = this;
    $scope.lbType = "label";
    $scope.selectedEdition = {};
    $scope.editionData = {};
    $scope.initStatus = true;
    $scope.marktoggleArray = [];
    $scope.marktoggleShow = [];
    $scope.initMarkStatus = false;
   

$scope.modelValueChanged = function (event , choice) {
            if(choice.optionValue != choice.oldValue){
               choice.editedStatus = true;
            }else{
               choice.editedStatus = false;    
            }
};


    /* 
     *method:isGroupShown
     *param :group
     */
    $scope.isGroupShown = function(group) {
        return $scope.marktoggleArray[group.persistenceId] !== $scope.initMarkStatus;
    };

    /* 
     *method:toggleGroup
     *param :group
     */
    $scope.toggleGroup = function(group) {
        if (group.type === "mark") {
            $scope.marktoggleArray[group.persistenceId] = !$scope.marktoggleArray[group.persistenceId];
            $scope.toggleHideAndShow(group);
        }
    };

    /* 
     *method:toggleHideAndShow
     *param :group
     */
    $scope.toggleHideAndShow = function(group) {
        angular.forEach($scope.editionData.editionRow, function(item) {
            angular.forEach(item.rowControlOption, function(rowData) {
                //if (rowData.optionClass === group.optionClass && !$scope.checkMark(rowData) && rowData.readOnly) {
                if (rowData.optionClass === group.optionClass && !$scope.checkMark(rowData)) {
                    $scope.marktoggleShow[rowData.persistenceId] = ($scope.isGroupShown(group)) ? false : true;
                }
            });
        });
    };

    /* 
     *method:getType
     *param :choice
     */
    $scope.getType = function(choice) {
        return (ctrl.removeSpace(choice.type) === "label" || ctrl.removeSpace(choice.type) === "mark") ? true : false;
    };
    
    
    
    $scope.getColor = function(choice) {
        var clr = "#fcc9b9;";
        return (ctrl.removeSpace(choice.type) === "label" || ctrl.removeSpace(choice.type) === "mark") ? $scope.properties.color : $scope.properties.separatorLineStype;
    };

    /* clr
     *method:checkMark
     *param :choice
     */
    $scope.checkMark = function(choice) {
        return (ctrl.removeSpace(choice.type) === "mark") ? true : false;
    };

    /* 
     *method:filterFn
     *param : 
     */
    $scope.filterFn = function() {
        if ($scope.properties.value) {
            $scope.editionData = $filter('filter')($scope.properties.value, {
                selected: "true"
            })[0];
            return $scope.editionData;
        }
    };

    /* 
     *method:getFormStatus
     *param : 
     */
    $scope.getFormStatus = function() {
               var editionDirty = true ;
               angular.forEach($scope.properties.value, function(valueEdition, keyEdition) {
                    angular.forEach(valueEdition.editionRow, function(valueEditionRow, keyEditionRow) {
                        angular.forEach(valueEditionRow.rowControlOption, function(valuerowControlOption, keyrowControlOption) {
                             if(valuerowControlOption.optionValue != valuerowControlOption.oldValue && ctrl.removeSpace(valuerowControlOption.type) != "label" && ctrl.removeSpace(valuerowControlOption.type) != "mark" ){
                                 editionDirty = false;
                            }
                        });
                    });
                });
                $scope.properties.hasChangedEditionStatus = editionDirty;
                
       return  editionDirty;               
    };


    /* 
     *method:getModel
     *param :choice 
     */
    this.getModel = function(choice) {
        if (angular.isString(choice.optionValue)) {
            choice.optionValue = this.removeSpace(choice.optionValue); //choice.optionValue.replace(/ /g,"");
            choice.optionValue = (choice.optionValue === "true") ? true : false;
        }
        if (angular.isString(choice.oldValue)) {
            choice.oldValue = this.removeSpace(choice.oldValue); //choice.optionValue.replace(/ /g,"");
            choice.oldValue = (choice.oldValue === "true") ? true : false;
        }
        return choice.optionValue;
    };

    /* 
     *method:hideAndShow
     *param :choice 
     */
    this.isDirtyRow = function(choice) {
        var bol = false ;
            if(choice.optionValue != choice.oldValue){
               choice.editedStatus = true;
               bol = true;  
            }else{
               choice.editedStatus = false;    
               bol = false;  
            }
             return bol;
    };

    /* 
     *method:getShowStatus
     *param :choice 
     */
    this.getShowStatus = function(choice) {
        var bol = choice.show;
        if (choice.relation) {
            angular.forEach($scope.editionData.editionRow, function(valueEditionRow, keyEditionRow) {
                angular.forEach(valueEditionRow.rowControlOption, function(valuerowControlOption, keyrowControlOption) {
                    if (valuerowControlOption.optionItemId == choice.parent) {
                        if (((choice.relation) ? choice.relation.trim() : "").toUpperCase() === "E") {
                            bol = valuerowControlOption.optionValue;
                        } else if (((choice.relation) ? choice.relation.trim() : "").toUpperCase() === "O") {
                            bol = !valuerowControlOption.optionValue;
                        }
                    }
                });
            });
        }
        return bol;
    };

    /* 
     *method:removeSpace
     *param :htmltype 
     */
    this.removeSpace = function(htmltype) {
        return (htmltype) ? htmltype.replace(/ /g, "") : htmltype;
    };

    /* 
     *method:getLabel
     *param :item 
     */
    this.getLabel = function(item) {
        return item.description;
    };

    /* 
     *method:$watch
     *param :properties.value 
     */
    $scope.$watch('properties.value', function(newValue, oldValue) {
        if ($scope.properties.value.length !=0) {
            angular.forEach($scope.properties.value, function(item) {
                if (item.selected === true) {
                    $scope.selectedEdition = item;
                    $scope.initStatus = true;
                }
            });
            if ($scope.initStatus) {
                    $scope.initStatus = false;
                    var mrktem;
                    $scope.markStyle = {
                      'padding-left': '0px',
                      'border-bottom-left-radius':'5px',
                      'border-bottom-right-radius':'5px',
                      'border-top-left-radius':'5px',
                      'border-top-right-radius':'5px',
                      'font-size': $scope.properties.optionClassFontSize+'px',
                      'background-color': $scope.properties.color
                        };
                        
                    $scope.optionStyle = {
                      'padding-left': '30px',
                      'border-bottom':$scope.properties.separatorLineStype +' '+ $scope.properties.separatorColor +' '+ $scope.properties.separatorLineThick+'px',
                      'background-color': 'white'
                        };    
                
                angular.forEach($scope.properties.value, function(valueEdition, keyEdition) {
                    angular.forEach(valueEdition.editionRow, function(valueEditionRow, keyEditionRow) {
                        angular.forEach(valueEditionRow.rowControlOption, function(valuerowControlOption, keyrowControlOption) {
                            valuerowControlOption.name = (valuerowControlOption.name) ? valuerowControlOption.name.trim() : valuerowControlOption.name;
                            valuerowControlOption.description = (valuerowControlOption.description) ? valuerowControlOption.description.trim() : valuerowControlOption.description;
                            valuerowControlOption.type = (valuerowControlOption.type) ? ctrl.removeSpace(valuerowControlOption.type) :null;
                            
                            if(valuerowControlOption.editedStatus && valuerowControlOption.oldValue != valuerowControlOption.optionValue){
                                if(ctrl.removeSpace(valuerowControlOption.type) != "label" && ctrl.removeSpace(valuerowControlOption.type) != "mark"){
                                 valuerowControlOption.preeditedStatus     = true;
                                 $scope.properties.hasChangedEditionStatus = false;
                                }
                            }else{
                                valuerowControlOption.editedStatus = false;
                                valuerowControlOption.oldValue = valuerowControlOption.optionValue;
                            }
                            
                            if (valuerowControlOption.type === "checkbox") {
                                ctrl.getModel(valuerowControlOption);
                            } else {
                                valuerowControlOption.optionValue = valuerowControlOption.optionValue.trim();
                            }
                            valuerowControlOption.parent = (valuerowControlOption.parent) ? valuerowControlOption.parent.trim() : valuerowControlOption.parent;
                            valuerowControlOption.relation = (valuerowControlOption.relation) ? valuerowControlOption.relation.trim() : valuerowControlOption.relation;
                            $scope.marktoggleShow[valuerowControlOption.persistenceId] = true;
                            if (valuerowControlOption.type === "mark") {
                                $scope.marktoggleArray[valuerowControlOption.persistenceId] = true;
                                mrktem = valuerowControlOption.optionClass;
                            } else {
                                if (mrktem === valuerowControlOption.optionClass) {
                                    $scope.marktoggleShow[valuerowControlOption.persistenceId] = false;
                                }
                            }
                           
                        });
                    });
                });
                $scope.copyValue = angular.copy($scope.properties.value);
            }
        }
    });
},
      template: '<!-- The custom widget template is defined here\n   - You can use standard HTML tags and AngularJS built-in directives, scope and interpolation system\n   - Custom widget properties defined on the right can be used as variables in a templates with properties.newProperty\n   - Functions exposed in the controller can be used with ctrl.newFunction()\n   - You can use the \'environment\' property injected in the scope when inside the Editor whiteboard. It allows to define a mockup\n     of the Custom Widget to be displayed in the whiteboard only. By default the widget is represented by an auto-generated icon\n     and its name (See the <span> below).\n   -->\n\n<div ng-class="{ \'form-horizontal\':  !properties.labelHidden && properties.labelPosition === \'left\' }">\n    <label ng-if="!properties.labelHidden" class="row"  \n    ng-style="getFormStatus()?{ \'color\':properties.beforeEditColor }:{\'color\': properties.afterEditColor }" > {{properties.label | uiTranslate}} </label>\n   <div ></div>\n\n    <div ng-if="!properties.inline">\n        <div class="row" ng-repeat="(key, editionRowValue) in filterFn().editionRow track by $index">\n            <div ng-repeat="(key, choice) in editionRowValue.rowControlOption track by $index" ng-show="ctrl.getShowStatus(choice)" ng-switch on="ctrl.removeSpace(choice.type)"> \n                 <div class="form-group col-xs-12" ng-show="marktoggleShow[choice.persistenceId]" \n                   ng-style="getType(choice)?markStyle:optionStyle">\n                     \n                    <div ng-class="getType(choice) ? \'col-xs-10\' : \'col-xs-5 col-md-3\'" style="float:left;text-align:left;">\n                        <label>\n                     <div ng-if="getType(choice)" ng-click="toggleGroup(choice)" >\n                      <i ng-if="checkMark(choice)" ng-class="isGroupShown(choice) ? \'glyphicon glyphicon-plus\' : \'glyphicon glyphicon-minus\'"></i>\n                      {{ choice.name }}\n                      <label style="{{properties.labelCSS}}" ng-show="choice.show" ng-disabled="choice.readOnly" >\n                            {{ ctrl.getLabel(choice) | uiTranslate }}  \n                       </label>\n                    </div>                         \n                    <div ng-if="!getType(choice)" \n                    ng-style="ctrl.isDirtyRow(choice)?{ \'color\':properties.afterEditColor }:{\'color\': properties.beforeEditColor }"\n                    >\n                    {{ choice.name }}  \n                    </div>\n                    </label>    \n                </div>\n				\n                <!--   ng-show="$index===0"  -->\n               \n                 \n                <div ng-if="!getType(choice)" class="col-xs-7">\n                    <!-- ng-switch start   -->\n                    \n                    \n                    \n                    <div ng-switch-when="checkbox" class="form-group">\n                        <label style="padding-left:0px ; {{properties.styleCSS}}" ng-show="choice.show">\n                        <input\n                           type="checkbox"\n                           ng-disabled="choice.readOnly || properties.disabled"\n                           ng-show="choice.show"\n                           ng-required="properties.required"\n                           \n                           ng-model="choice.optionValue"\n                           ng-checked="ctrl.getModel(choice)"\n                           ng-click="ctrl.isDirtyRow(choice)"\n                           style="{{properties.styleCSS}}"\n                           \n                           >  \n                            <!--   ng-click="ctrl.hideAndShow(choice)" -->\n                        {{ ctrl.getLabel(choice)  | uiTranslate }} \n                        </label>\n                    </div>\n                    <!-- checkbox close   -->\n                    <!--  <div ng-switch-when="label">\n                         \n                        <label style="{{properties.labelCSS}}"  \n                           ng-show="choice.show"\n                           ng-disabled="choice.readOnly"\n                           >\n                        {{ ctrl.getLabel(choice) | uiTranslate }}\n                         \n                        <i ng-class="isGroupShown(choice) ? \'glyphicon glyphicon-minus\' : \'glyphicon glyphicon-plus\'" ng-click="toggleGroup(choice)"></i>\n                        \n                        </label> \n                     </div>\n                       label close -->\n                    <div ng-switch-when="text" class="form-group">\n                        <input type="text" ng-disabled="choice.readOnly || properties.disabled" ng-show="choice.show" ng-required="properties.required"  ng-model="choice.optionValue"  style="{{properties.styleCSS}}" > <!--ng-keydpress="ctrl.checkEditStatus(choice)" -->\n                        <label style="{{properties.styleCSS}}" ng-show="choice.show" >\n                        {{ ctrl.getLabel(choice) | uiTranslate }}\n                        </label>\n                    </div>\n                    <div ng-switch-when="textarea" class="form-group">\n                        <!-- textarea　start  -->\n                        <textarea rows="{{properties.textareaRows}}" cols="{{properties.textareaCols}}" ng-model="$parent.choice.optionValue" ng-disabled="choice.readOnly || properties.disabled" ng-show="choice.show" ng-required="properties.required"  style="{{properties.styleCSS}}" ng-blur="ctrl.checkEditStatus(choice)" ng-keydpress="ctrl.checkEditStatus(choice)">\n                            \n                        </textarea>\n                        <br>\n                        <label style="{{properties.styleCSS}}" ng-show="choice.show">\n                        {{ ctrl.getLabel(choice) | uiTranslate }}\n                        </label>\n                    </div>\n                    <!-- textarea close -->\n                    <div ng-switch-default class="form-group">\n                         <label>\n                          {{   (choice.type)?choice.type:"Type is not Defined"}}\n                        </label>\n                    </div>\n                    <!-- ng-switch close  -->\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n</div>\n'
    };
  });
