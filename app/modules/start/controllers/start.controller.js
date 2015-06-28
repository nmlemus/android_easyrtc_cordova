'use strict';

/**
 * @ngdoc object
 * @name start.Controllers.StartroutesController
 * @description StartroutesController
 * @requires ng.$scope
*/
angular
    .module('start')
    .controller('StartRoutesController', [
        '$scope', '$state', '$cordovaPreferences', '$cordovaSQLite', '$rootScope',
        function($scope, $state, $cordovaPreferences, $cordovaSQLite, $rootScope) {

        document.addEventListener('deviceready', onDeviceReady, false);

        function onDeviceReady() {
  			$rootScope.db = window.sqlitePlugin.openDatabase({name: "goblob.db"});

			  $rootScope.db.transaction(function(tx) {
			     tx.executeSql('CREATE TABLE IF NOT EXISTS profile_table (id integer primary key, profile_name text, profile_status text)');
			     tx.executeSql('CREATE TABLE IF NOT EXISTS chat_table (id integer primary key, contact_name text, chat_text text, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');

			    // demonstrate PRAGMA:
			    $rootScope.db.executeSql("pragma table_info (profile_table);", [], function(res) {
			      console.log("PRAGMA res: " + JSON.stringify(res));
			    });

			    tx.executeSql("select count(id) as cnt, profile_name from profile_table;", [], function(tx, res) {
			      console.log("res.rows.length: " + res.rows.length + " -- should be 1");
			      console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");

			      if (res.rows.item(0).cnt === 0){
			      	$state.go("register");	
			      }else{
			      	$state.go("home", {phonenumber:res.rows.item(0).profile_name});
			      }

			    }, function(e) {
			      console.log("ERROR: " + e.message);
			    });
			  });
		}

        	$scope.setName = function () {
    			$cordovaPreferences.set('name_identifier', $scope.name).then(function () {
      				console.log('successfully saved!');
    			})
  			};

  			$scope.getName = function () {
    			$cordovaPreferences.get('name_identifier').then(function (name) {
      				$scope.name = name;
    			})
  			};
    }
]);
