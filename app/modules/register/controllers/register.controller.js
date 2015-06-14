'use strict';

/**
 * @ngdoc object
 * @name register.Controllers.RegistercontrollerController
 * @description RegistercontrollerController
 * @requires ng.$scope
*/
angular
    .module('register')
    .controller('RegisterController', [
        '$scope', 'Profiles', '$state',
        function($scope, Profiles, $state) {

    $scope.createUser = function() {

               $state.go("home", {phonenumber:$scope.username});

    }

}]);
