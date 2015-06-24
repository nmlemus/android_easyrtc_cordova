'use strict';

/**
 * @ngdoc object
 * @name call.Controllers.CallController
 * @description CallController
 * @requires ng.$scope
*/
angular
    .module('call')
    .controller('CallController', [
        '$scope', '$rootScope', '$state',
        function($scope, $rootScope, $state) {
            if(!$rootScope.phonenumber) {
                $state.go("register");
            }
            $rootScope.video = document.getElementById('callerAudio');

            $scope.hangup = function(event) {
                easyrtc.hangupAll();
                easyrtc.getLocalStream().stop();
                $state.go("contacts");
            }
   }
]);
