(function(module) {
try {
  module = angular.module('org.bonitasoft.portalTemplates');
} catch (e) {
  module = angular.module('org.bonitasoft.portalTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  /*
  $templateCache.put('portalTemplates/user/tasks/list/master-maintenance.html',
    '<!-- Reset style for the page. Dirty but avoid having to break all other pages -->\n' +
    '<style>\n' +
    '    html, body, body #content {\n' +
    '        height: 100%;\n' +
    '        margin: 0;\n' +
    '    }\n' +
    '</style>\n' +
    '<toast></toast>\n' +
    '<div class="TaskListPage" ng-cloak substitute-app form-spy \n' +
    '     ng-class="{\n' +
    '      \'TaskListPage--small\':app.smallScreen,\n' +
    '      \'TaskListPage--withMenu\':!app.smallScreen && app.showMenu}">    \n' +
    '    <div class="OffcanvasMenu navbar">\n' +
    '   <ul class="TaskFilters nav nav-pills nav-stacked">  \n' +
    ' <li role="presentation"  class="active">  \n' +
    '    \n' +
    ' </li>    \n' +
    ' <li role="presentation"  >  \n' +
    '   \n' +
    ' </li>   \n' +
    ' <li role="presentation"  >  \n' +
    '    \n' +
    ' </li>   \n' +
    ' </ul>  \n' +
    '    </div>\n' +
    '    <div class="TaskList"  >\n' +
    '        <div class="TaskList-filters panel panel-default">\n' +
    '            <div class="panel-heading title ng-binding" translate>Substitute User</div>\n' +
    '            <div class="panel-body">\n' +
    '               <div class="row">\n' +
    '                <div class="col-md-7 button-filter ng-binding" >\n' +
    '              </div>\n' +
    '             <div>\n' +
    '                <div class="col-md-12">\n' +
    '                </div>\n' +
    '                    <div class="col-sm-8 col-lg-8">  <fieldset> \n' +
    '                    <form role="form" name="substitu" >\n' +
    '     <div class="row"> \n' +
  	' 		<div class="col-sm-5"> \n' +
  	' 			<div class="form-group"> \n' +
  	' 					<label for="user_name"> {{ \'Group\' | translate }}   </label> \n' +
  	' 					<select name="grouplistName" id="grouplistId" class="form-control"  ng-options="(option.path.slice( 1 )) for option in groupList track by option.id" \n' +
  	' 		              ng-init="groupSelectedOption = groupList[0]"  ng-model="groupSelectedOption" required  ng-change="onChangeGroup(groupSelectedOption)" >  <option value=""> Please select </option> </select> \n' +
  	' 		 </div> \n' +
  	' 	</div> \n' +
  	' 	<div class="col-sm-5"> \n' +
  	' 		<div class="form-group"> \n' +
  	' 			<label for="user_list"> {{ \'User\' | translate }}  </label> \n' +
  	' 			<select name="userlistName" id="userlistId" class="form-control"  ng-options="(option.firstname + option.lastname) for option in userList track by option.id" \n' +
  	' 					    ng-init="userSelectedOption = userList[0]" ng-model="userSelectedOption" required >  <!-- <option value=""> Please select </option>  --> </select> \n' +
    ' 		</div> \n' +
  	' 	</div>\n' +
  	' </div>\n' +
    '  <div class="row"> \n' +
    '  <div class="col-sm-5">\n' +
    '      <div class="form-group">\n' +
    '          <label for="user_name">  <translate> From Dateee </translate> </label>\n' +
    ' <p class="input-group"> <input type="text" ng-click="fromDateOpen($event)" class="form-control" datepicker-popup="{{format}}" ng-model="dateDuration.fromDate"  is-open="fOpened"  min-date="minDate" max-date="maxDate" datepicker-options="dateOptions"  \n' +
    ' ng-required="true" close-text="Close" /> <!--date-disabled="disabled(date, mode)" --> \n' +
    ' <span class="input-group-btn"> <button type="button" class="btn btn-default" ng-click="fromDateOpen($event)"><i class="glyphicon glyphicon-calendar"></i></button></span> \n' +
    ' </p> </div>\n' +
    '    </div>\n' +
    '  <div class="col-sm-5">\n' +
    '      <div class="form-group">\n' +
    '        <label for="user_list">     To Date</label>\n' +
    ' <p class="input-group"> <input type="text" ng-click="toDateOpen($event)" class="form-control" datepicker-popup="{{format}}" ng-model="dateDuration.toDate" is-open="tOpened"  min-date="tominDate" max-date="maxDate" datepicker-options="dateOptions"  \n' +
    ' ng-required="true" close-text="Close" /> \n' +
    ' <span class="input-group-btn"> <button type="button" class="btn btn-default" ng-click="toDateOpen($event)"><i class="glyphicon glyphicon-calendar"></i></button></span> \n' +


    '    </p>   </div>\n' +
    '  </div>\n' +
    '  </div>\n' +
    ' <div class="row"> \n' +
	  ' <div class="col-sm-10"> \n' +
		' <div class="form-group"> \n' +
		' <div > \n' +
    '  <label> <input  type="checkbox" ng-click="modeChange(data.substituteMode)" ng-model="data.substituteMode"  ng-checked="data.substituteMode" /> Mode</label> \n' +
    '  </div> \n' +
		'</div> \n' +
		'</div> \n' +
	  '</div> \n' +
	  ' <div class="row"> \n' +
		' <div class="col-sm-8"> \n' +
		' <div class="form-group"> \n' +
		' <div class="alert {{messageClass}}" ng-show="alrtMsg.hidden"   > \n' +
    '   {{ alertMessage }}   \n' +
    ' </div> \n' +
    '<div class="row" ng-show="ovelapArryTblShow" > \n' +
    '<table class="table table-striped">\n' +
    '<thead>\n' +
    '<tr>\n' +
    '<th>Date From</th>\n' +
    '<th>Date To</th>\n' +
    '</tr>\n' +
    '</thead>\n' +
    '<tbody>\n' +
    '<tr ng-repeat="x in ovelapArry">\n' +
    '<td>  {{ x.dateFrom }} </td>\n' +
    '<td>{{ x.dateTo }} </td>\n' +
    '</tr>\n' +
    '</tbody>\n' +
    '</table> \n' +
    '</div> \n' +

		'	</div>\n' +
		'  </div> \n' +
		' <div class="col-sm-2"> \n' +
		' <div class="form-group"> \n' +
		' <div class="checkbox"> \n' +
		'<button type="button" class="btn btn-primary pull-right _1 _last odd " ng-disabled="substitu.$invalid"  ng-click="userSubmit()"  >Submit</button> \n' +
		'</div> \n' +
		'	</div>\n' +
		'	</div> \n' +
	  '</div> \n' +
    '                    </form>\n' +
    '                    </fieldset></div>\n' +
    '                </div>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +

    '</div>\n' +
    '');
    */
}]);
})();
/*
(function(module) {
try {
  module = angular.module('org.bonitasoft.portalTemplates');
} catch (e) {
  module = angular.module('org.bonitasoft.portalTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('portalTemplates/user/tasks/list/comments/comments.html',
    '<section class="Comments">\n' +
    '    <header class="Comments-header" translate>\n' +
    '        Case comments\n' +
    '    </header>\n' +
    '\n' +
    '    <div class="Comments-content" scroll-bottom="vm.comments">\n' +
    '        <div class="Comment" ng-repeat="comment in vm.comments">\n' +
    '            <img class="Comment-icon" ng-src="../theme/{{comment.userId.icon}}" alt="Author" onerror="this.style.display=\'none\'"/>\n' +
    '            <div class="Comment-header">\n' +
    '                {{ comment.userId.firstname + \' \' + comment.userId.lastname }} <span class="text-muted">{{ comment.postDate | moment:\'lll\' }}</span>\n' +
    '            </div>\n' +
    '            <div class="Comment-content">{{ comment.content }}</div>\n' +
    '        </div>\n' +
    '        <div ng-if="vm.comments.length == 0" class="text-muted" translate>No comment on this case yet. To add one, use the input field at the bottom of this panel</div>\n' +
    '    </div>\n' +
    '\n' +
    '    <footer class="Comments-footer">\n' +
    '        <form name="CaseCommentsForm" class="CommentForm" ng-class="{ \'text-muted\': !vm.isCurrentCaseOpened() }" ng-submit="vm.addComment(vm.newComment)">\n' +
    '        <div class="form-group" ng-class="{\'has-error\': CaseCommentsForm.$error.maxlength }">\n' +
    '            <textarea id="comment" class="form-control"\n' +
    '                      placeholder="{{ \'New comment\' | translate }}"\n' +
    '                      ng-model="vm.newComment"\n' +
    '                      ng-maxlength="255"\n' +
    '                      ng-required="true"\n' +
    '                      ng-disabled="!vm.isCurrentCaseOpened()">\n' +
    '            </textarea>\n' +
    '            <span class="help-block CommentForm-help" translate>Maximum size 255 characters</span>\n' +
    '        </div>\n' +
    '        <button type="submit" class="btn btn-default" ng-disabled="CaseCommentsForm.$invalid" translate>Add</button>\n' +
    '        <span ng-if="!vm.isCurrentCaseOpened()" class="CommentForm-disabledMsg" translate>The case is archived. You cannot add comments anymore</span>\n' +
    '    </form>\n' +
    '    </footer>\n' +
    '\n' +
    '</section>\n' +
    '');
}]);
})();
*/
