'use strict';

/**
 * @ngdoc object
 * @name chat.Controllers.ChatController
 * @description ChatController
 * @requires ng.$scope
 */
angular
    .module('chat')
    .controller('ChatController', [
        '$scope', '$state', '$rootScope', '$interval',
        function($scope, $state, $rootScope, $interval) {
            if(!$rootScope.phonenumber) {
                $state.go("register");
            }

            document.getElementById("message").onkeyup = function (e) {
                if (e.keyCode == 13) {
                    if (e.shiftKey === true) {

                    }
                    else {
                        $scope.$apply(function () {
                            $scope.send();
                        });
                    }
                    return false;
                }else  if (e.keyCode == 27) {
                    $scope.back();
                }
            }

            $scope.send = function(){
                //errorDiv.style.display = "none";
                var stringToSend = document.getElementById('message').value;
                if (stringToSend && stringToSend != "" && stringToSend != "\n") {
                    if (easyrtc.lost_connection[$rootScope.person.name]) {
                        easyrtc.sendDataP2P($rootScope.person.name, "message", stringToSend);
                    }
                    else {
                        easyrtc.sendDataWS($rootScope.person.name, "message", stringToSend);
                    }
                    $rootScope.person.messages[$rootScope.person.messages.length] = {
                        username: "Me",
                        text: stringToSend,
                        time: new Date(),
                        timestamp: 'just now'
                    };
                }
                //alert(moment(new Date()).startOf('minute').fromNow());


                var inputMsg = document.getElementById('message');
                inputMsg.value = "";
                inputMsg.focus();
            }


            updateTimes();
            var timer = $interval(function(){
                updateTimes();
            }, 60000);


            function updateTimes(){
                for(var i = 0; i< $rootScope.person.messages.length; i++){
                    $rootScope.person.messages[i].timestamp = moment($rootScope.person.messages[i].time).startOf('minute').fromNow()
                }
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            }


            $scope.back = function(){
                $interval.cancel(timer);
                $rootScope.person = '';
                $state.go("contacts");
            }





        }
    ]);
