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

            $rootScope.timeToMissing();

            $scope.hangup = function(event) {
                easyrtc.hangupAll();
                $rootScope.stopTimer();
				if($rootScope.video.style.visibility != "visible")
					easyrtc.question($rootScope.person.name, {call: 'missing'});
                if(easyrtc.getLocalStream())
                    easyrtc.getLocalStream().stop();
				$rootScope.person = '';
                $state.go("contacts");
            }
   }
]);
