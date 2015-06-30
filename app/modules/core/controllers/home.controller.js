'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', ['$rootScope', '$state', 'Users', '$http', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$mdDialog', '$cordovaGeolocation', '$cordovaCamera', '$stateParams', '$interval',
        function ($rootScope, $state, Users, $http, $timeout, $mdSidenav, $mdUtil, $log, $mdDialog, $cordovaGeolocation, $cordovaCamera, $stateParams, $interval) {

            $rootScope.phonenumber = $stateParams.phonenumber;
			
			
			
			document.addEventListener('deviceready', function () {
    // Android customization
    cordova.plugins.backgroundMode.setDefaults({ 
	title:  'Goblob',
    ticker: 'Goblob',
    text:   'Goblob'
	}
	);
    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        setTimeout(function () {
            // Modify the currently displayed notification
            cordova.plugins.backgroundMode.configure({
				title: 'Goblob',
                text:'Running in background.'
            });
        }, 5000);
    }
	
	

}, false);




            $rootScope.people = [];

            var callinprogress = false;

            if ($rootScope.phonenumber) {
                $state.go("contacts").then(function () {
				
                var SERVER_IP = '192.168.223.1';
                var SERVER_PORT = 3000;

                easyrtc.setSocketUrl("https://" + SERVER_IP + ":" + SERVER_PORT, {
                    host: SERVER_IP
                    , secure: true
                    , port: SERVER_PORT
                });

                easyrtc.setUsername($rootScope.phonenumber);


                easyrtc.connect("easyrtc.instantMessaging", loginSuccess, loginFailure);


                easyrtc.setPeerListener(function (easyrtcid, msgType, content) {
                    var id = findID(easyrtcid, $rootScope.people);
                    if (id != -1) {
                        $rootScope.people[id].messages[$rootScope.people[id].messages.length] = {
                            username: easyrtcid,
                            text: content,
                            time: new Date(),
                            timestamp: 'just now'
                        };
                        if (!$rootScope.person || $rootScope.person.name != easyrtcid) {
                            $rootScope.people[id].newMessage = 'block';
                            $rootScope.people[id].notification_count++;
                        }
                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
						
						
						cordova.plugins.notification.local.schedule({
							id: easyrtcid,
							title: "Message from "+easyrtcid,
							text: content
						});
			
						cordova.plugins.notification.local.on("click", function (notification, state) {
								var id = findID(notification.id, $rootScope.people);
								$rootScope.person = $rootScope.people[id];
								$rootScope.person.newMessage = 'none';
								$rootScope.person.notification_count = 0;
								$state.go("chat");
						}, this);
						
						
						
                    }
                });


                easyrtc.setRoomOccupantListener(function (roomName, occupants, isPrimary) {
                    var s = [];
                    var tmp = $rootScope.people;
                    $rootScope.people = [];
                    for (var easyrtcid in occupants) {
                        easyrtc.getUser(easyrtcid,
                            function (msgType, msgData) {
                                if (msgData) {
                                    var id = findID(msgData.profile_name, tmp);
                                    var msg = [];
                                    var newMessage = 'none';
                                    var notification_count = 0;
                                    if (id != -1) {
                                        msg = tmp[id].messages;
                                        newMessage = tmp[id].newMessage;
                                        notification_count = tmp[id].notification_count;
                                    }
                                    $rootScope.people[$rootScope.people.length] = {
                                        name: msgData.profile_name,
                                        img: 'img/ic_account_circle_128.png',
                                        newMessage: newMessage,
                                        profile_status: msgData.profile_status,
                                        messages: msg,
                                        notification_count: notification_count
                                    };
                                    if (!$rootScope.$$phase)
                                        $rootScope.$apply();
                                }
                            },
                            function (errorCode, errorText) {
                                easyrtc.showError(errorCode, errorText);
                            }
                        );
                    }
                    if (!$rootScope.$$phase)
                        $rootScope.$apply();
                });
				});
            } else {
                $state.go("register");
            }


            function findID(id, people) {
                for (var i = 0; i < people.length; i++) {
                    if (people[i].name == id)
                        return i;
                }
                return -1;
            }


            //var socket = io.connect('https://localhost', {secure: true});
            function loginSuccess(easyrtcid) {
                console.log("logged in");
                easyrtc.getUser(easyrtcid,
                    function (msgType, msgData) {
                        if (!msgData) {
                            easyrtc.createUser(easyrtcid,
                                function (msgType, msgData) {
                                    easyrtc.updateStatus(easyrtcid, "online",
                                        function (msgType, msgData) {

                                        },
                                        function (errorCode, errorText) {
                                            easyrtc.showError(errorCode, errorText);
                                        }
                                    );
                                },
                                function (errorCode, errorText) {
                                    easyrtc.showError(errorCode, errorText);
                                }
                            );
                        }
                        easyrtc.joinRoom("chat", null,
                            function (roomName, roomOwner) {
                                console.log("I'm now in room " + roomName + " owner " + roomOwner);
                            },
                            function (errorCode, errorText, roomName) {
                                console.log("had problems joining " + roomName);
                            });
                    },
                    function (errorCode, errorText) {
                        easyrtc.showError(errorCode, errorText);
                    }
                );
            }

            easyrtc.setDisconnectListener(function () {
                easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
            });

            function loginFailure(errorCode, message) {
                console.log("disconnected");
                alert(message);
			    $state.go("home", {phonenumber:$rootScope.phonenumber});
            }


            easyrtc.setAcceptChecker(function (easyrtcid, callback) {
				cordova.backgroundapp.show();
                if (easyrtc.getCallType() == 'audio') {
                    easyrtc.enableVideo(false);
                    easyrtc.enableVideoReceive(false);
                } else if (easyrtc.getCallType() == 'video') {
                    easyrtc.enableVideo(true);
                    easyrtc.enableVideoReceive(true);
                }

                var s = "Accept incoming " + easyrtc.getCallType() + " call from " + easyrtcid + "?";
                if (easyrtc.getConnectionCount() > 0) {
                    s = "Drop current call and accept new " + easyrtc.getCallType() + " call from " + easyrtcid + "?";
                }
                var confirm = $mdDialog.confirm()
                    .title('Accept call')
                    .content(s)
                    .ok('Accept')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
                    $rootScope.person = $rootScope.people[findID(easyrtcid, $rootScope.people)];
                    if (easyrtc.getConnectionCount() > 0) {
                        callinprogress = true;
                        easyrtc.hangupAll();
                    }
                    if (easyrtc.getCallType() == 'audio') {
                        $state.go("call").then(function () {
                            easyrtc.initMediaSource(
                                function () {
                                    callback(true);
                                },
                                function (errorCode, errmesg) {
                                    easyrtc.showError(errorCode, errmesg);
                                }  // failure callback
                            );
                        });
                    } else if (easyrtc.getCallType() == 'video') {
                        $state.go("videocall").then(function () {
                            easyrtc.initMediaSource(
                                function () {
                                    var selfVideo = document.getElementById("box0");
                                    easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                                    callback(true);
                                },
                                function (errorCode, errmesg) {
                                    easyrtc.showError(errorCode, errmesg);
                                }  // failure callback
                            );
                        });
                    }
                }, function () {
                    callback(false);
                });
            });


            var timer;

            function time(input) {
                function z(n) {
                    return (n < 10 ? '0' : '') + n;
                }

                var seconds = input % 60;
                var minutes = Math.floor(input / 60);
                var hours = Math.floor(minutes / 60);
                if (hours == 0 && minutes == 0)
                    return z(seconds);
                if (hours == 0)
                    return z(minutes) + ':' + z(seconds);
                return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
            };


            easyrtc.setStreamAcceptor(function (easyrtcid, stream) {
                $interval.cancel(timer);
                if (easyrtc.getCallType() == 'video') {
                    $rootScope.handleWindowResize();
                }
                $rootScope.video.style.visibility = "visible";
                easyrtc.setVideoObjectSrc($rootScope.video, stream);


                var seconds = 0;
                timer = $interval(function () {
                    seconds++;
                    $rootScope.timercount = time(seconds);
                    console.log(time(seconds));
                }, 1000);
            });


            easyrtc.setOnStreamClosed(function (easyrtcid) {
                    if (easyrtc.getCallType() == 'missing') {
						$mdDialog.cancel();
                    } else {
                        easyrtc.setVideoObjectSrc($rootScope.video, "");
                        easyrtc.getLocalStream().stop();
                        if (!callinprogress) {
                            $rootScope.person = '';
                            $state.go("contacts");
                        }
                        callinprogress = false;
                        $interval.cancel(timer);
                        $rootScope.timercount = '';
                        if (!$rootScope.$$phase)
                            $rootScope.$apply();
                    }
                }
            );


            $rootScope.handleWindowResize = function () {

                $rootScope.fullpage.style.width = window.innerWidth + "px";
                $rootScope.fullpage.style.height = window.innerHeight + "px";
                var connectCount = easyrtc.getConnectionCount();

                function applyReshape(obj, parentw, parenth) {
                    var myReshape = obj.reshapeMe(parentw, parenth);
                    if (myReshape) {
                        if (typeof myReshape.left !== 'undefined') {
                            obj.style.left = Math.round(myReshape.left) + "px";
                        }
                        if (typeof myReshape.top !== 'undefined') {
                            obj.style.top = Math.round(myReshape.top) + "px";
                        }
                        if (typeof myReshape.width !== 'undefined') {
                            obj.style.width = Math.round(myReshape.width) + "px";
                        }
                        if (typeof myReshape.height !== 'undefined') {
                            obj.style.height = Math.round(myReshape.height) + "px";
                        }

                        var n = obj.childNodes.length;
                        for (var i = 0; i < n; i++) {
                            var childNode = obj.childNodes[i];
                            if (childNode.reshapeMe) {
                                applyReshape(childNode, myReshape.width, myReshape.height);
                            }
                        }
                    }
                }

                applyReshape($rootScope.fullpage, window.innerWidth, window.innerHeight);
            }

		
            $rootScope.timeToMissing = function () {
                var seconds = 0;
                timer = $interval(function () {
                    seconds++;
                    if (seconds == 60) {
                        easyrtc.hangupAll();
						$rootScope.stopTimer();
                        if (easyrtc.getLocalStream())
                            easyrtc.getLocalStream().stop();
                        easyrtc.question($rootScope.person.name, {call: 'missing'});
						$rootScope.person = '';
                        $state.go("contacts");
                    }
                }, 1000);
            }


            $rootScope.stopTimer = function () {
                $interval.cancel(timer);
            }


        }
    ]);


