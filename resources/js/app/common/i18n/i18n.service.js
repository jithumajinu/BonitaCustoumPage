/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful);
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
(function() {
  'use strict';

  angular
    .module('org.bonitasoft.common.i18n')
    .service('i18nService', i18nService);

  function i18nService(gettextCatalog, locale, i18nAPI, I18N_KEYS,$q,$http) {
    gettextCatalog.debug = false;

    return {
      getKey: getKey,
      translationsLoadPromise: translationsLoadPromise()
    };

    function getKey(key, context) {
      return gettextCatalog.getString(I18N_KEYS[key] || key, context);
    }

    function translationsLoadPromise() {
      return i18nAPI.query({
        f: 'locale=' + locale.get()
      }).$promise.then(updateCatalog);
    }


/*    function getCustomi18n() {
      var defer = $q.defer();
      console.log(1);
       $http.get('js/app/common/i18n/master.json').success(function(result) {
             console.log(2);
             defer.resolve(result);
        });
        console.log(3);
        return defer.promise;
    }

*/
    function updateCatalog(catalog) {
      function arrayToObject(array) {
        var object = {};
        for (var i = 0; i < array.length; i++) {
          object[array[i].key] = array[i].value;
        }
        if(locale.get() ==="ja"){
        object["Migration process selection screen"]  ="移行プロセス選択画面";
        object["Submit"]  ="登録";
        object["Selected Data Successfully Inserted"]  ="移行プロセスの予約をおこないました。";
        object["Are you sure you want to migrate this record?"]  ="移行プロセスの予約をおこないます。よろしいですか？";
        object["Confirmation for submit"]  ="移行プロセスの確認";
        object["Process Id"]  ="プロセスID";
        object["Case Id"]  ="ケースID";
        object["Migration process request list"]  ="移行プロセス要求リスト画面";

        }
        return object;
      }
      gettextCatalog.currentLanguage = locale.get();
      gettextCatalog.baseLanguage = null;
    /*   getCustomi18n().then(function(data) {
          console.log(data);
          console.log(4);
       })
       console.log(5);*/
      gettextCatalog.setStrings(locale.get(), arrayToObject(catalog));
    }
  }
})();
