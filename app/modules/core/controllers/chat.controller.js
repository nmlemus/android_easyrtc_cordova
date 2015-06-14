'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('ChatController', ['$scope', '$state', 'Users', '$http', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$mdDialog', '$cordovaGeolocation', '$cordovaCamera', '$stateParams',
        function($scope, $state, Users, $http, $timeout, $mdSidenav, $mdUtil, $log, $mdDialog, $cordovaGeolocation, $cordovaCamera, $stateParams) {
            $scope.person = $stateParams.person;
            $scope.back = function(){
                $state.go("home");
            }

        }
    ]);


