'use strict';
var ApplicationConfiguration = (function() {
    var applicationModuleName = 'angularjsapp';
    var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngMaterial', 'ngCordova', 'ngMdIcons', 'ng-mfb', 'internationalPhoneNumber'];
    var registerModule = function(moduleName) {
        angular
            .module(moduleName, []);
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });

'use strict';

ApplicationConfiguration
    .registerModule('call');

'use strict';

ApplicationConfiguration
    .registerModule('chat');

'use strict';

ApplicationConfiguration
    .registerModule('contacts');

'use strict';

ApplicationConfiguration.registerModule('core');

'use strict';

ApplicationConfiguration
    .registerModule('register');

'use strict';

ApplicationConfiguration
    .registerModule('start');

'use strict';

ApplicationConfiguration
    .registerModule('videocall');

'use strict';

angular
    .module('call')
    .config(['$stateProvider',
        function($stateProvider) {
                        $stateProvider
                .state('call', {
                    url: '/call',
                    templateUrl: 'modules/call/views/call.html',
                    controller: 'CallController'
                });
        }
    ]);

'use strict';

angular
    .module('chat')
    .config(['$stateProvider',
        function($stateProvider) {
                        $stateProvider
                .state('chat', {
                    url: '/chat',
                    templateUrl: 'modules/chat/views/chat.html',
                    controller: 'ChatController'
                });
        }
    ]);

'use strict';

angular
    .module('contacts')
    .config(['$stateProvider',
        function($stateProvider) {
                        $stateProvider
                .state('contacts', {
                    url: '/contacts',
                    templateUrl: 'modules/contacts/views/contacts.html',
                    controller: 'ContactsController'
                });
        }
    ]);

'use strict';

angular
    .module('core')
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

                        $stateProvider
                .state('home', {
                    url: '/home',
                    params:{phonenumber:null},
                    templateUrl: 'modules/core/views/home.html',
                    controller: 'HomeController'
                });
        }
    ]);

'use strict';
angular.module('register').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('register', {
			url: '/register',
			templateUrl: 'modules/register/views/register.html',
            controller: 'RegisterController'
		});
	}
]);

'use strict';

angular
    .module('start')
    .config(['$stateProvider',
        function($stateProvider) {
                        $stateProvider
                .state('startroutes', {
                    url: '/',
                    templateUrl: 'modules/start/views/startview.html',
                    controller: 'StartRoutesController'
                });
        }
    ]);

'use strict';

angular
    .module('videocall')
    .config(['$stateProvider',
        function($stateProvider) {
                        $stateProvider
                .state('videocall', {
                    url: '/videocall',
                    templateUrl: 'modules/videocall/views/videocall.html',
                    controller: 'VideocallController'
                });
        }
    ]);

'use strict';
angular.module('core').factory('Users', ['$resource',
    function($resource) {
        return $resource('http://10.0.0.104:3000/profiles', null, {
        	'update': {method: 'PUT'}});
    }
]);
'use strict';

angular
    .module('register')
    .factory('Profiles', ['$resource',
        function($resource) {
            return $resource('https://goblob.com/userused', {}, {update: {method: 'PUT'}});    
        }
    ]);
'use strict';

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

'use strict';

angular
    .module('chat')
    .controller('ChatController', [
        '$scope', '$state', '$rootScope', '$interval',
        function($scope, $state, $rootScope, $interval) {
            if(!$rootScope.phonenumber) {
                $state.go("register");
                return;
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

'use strict';

angular
    .module('contacts')
    .controller('ContactsController',['$scope', '$rootScope', '$state', 'Users', '$http', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$mdDialog', '$cordovaGeolocation', '$cordovaCamera','$stateParams', '$interval',
        function($scope, $rootScope, $state, Users, $http, $timeout, $mdSidenav, $mdUtil, $log, $mdDialog, $cordovaGeolocation, $cordovaCamera, $stateParams, $interval) {

            if(!$rootScope.phonenumber) {
                $state.go("register");
            }

            $scope.postPhoneNumber = function(){
                var username = this.phone;
                var user = new Users({
                    profile_name : this.phone
                });

                console.log(username);
                $state.go("register");
            };

            $scope.getLocation = function () {

                $cordovaGeolocation
                    .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
                    .then(function (position) {
                        console.log("position found");
                        $scope.position = position;
                    }, function (err) {
                        console.log("unable to find location");
                        $scope.errorMsg = "Error : " + err.message;
                    });
            };


            $scope.takePicture = function () {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA
                };
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.cameraimage = "data:image/jpeg;base64," + imageData;
                }, function (err) {
                    console.log('Failed because: ');
                    console.log(err);
                });
            };

            $scope.data = {
                selectedIndex: 0,
                secondLocked:  false,
                secondLabel:   "Favorites",
                bottom:        false
            };



            $scope.goToPerson = function(person, event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('Navigating')
                        .content('Inspect ' + person)
                        .ariaLabel('Person inspect demo')
                        .ok('Neat!')
                        .targetEvent(event)
                );
            };





            $scope.openChat = function(event, person) {
                $rootScope.person = person;
                person.newMessage = 'none';
                person.notification_count = 0;
                $state.go("chat");
            };



            $scope.call = function(event, person) {
                easyrtc.question(person.name, {call: 'audio'});
                $rootScope.person = person;
                $state.go("call");
                easyrtc.enableVideo(false);
                easyrtc.enableVideoReceive(false);
                easyrtc.initMediaSource(
                    function(){
                        var acceptedCB = function(accepted, caller) {
                            if( !accepted ) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .title('CALL-REJECTED')
                                        .content("Sorry, your call to " + easyrtc.idToName(caller) + " was rejected")
                                        .ok('Ok')
                                        .targetEvent(event)
                                );
                                $rootScope.person = '';
								easyrtc.getLocalStream().stop();
								$rootScope.stopTimer();
                                $state.go("contacts");
                            }
                        };
                        var successCB = function() {
                        };
                        var failureCB = function() {
                        };
                        easyrtc.call(person.name, successCB, failureCB, acceptedCB);
                    },
                    function(errorCode, errmesg){
                        easyrtc.showError(errorCode, errmesg);
                    }  // failure callback
                );
            };


            $scope.videoCall = function(event, person) {
                easyrtc.question(person.name, {call: 'video'});
                $rootScope.person = person;
                $state.go("videocall");
                easyrtc.enableVideo(true);
                easyrtc.enableVideoReceive(true);
                easyrtc.initMediaSource(
                    function(){
                        var selfVideo = document.getElementById("box0");
                        easyrtc.setVideoObjectSrc(selfVideo, easyrtc.getLocalStream());
                        var acceptedCB = function(accepted, caller) {
                            if( !accepted ) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .title('CALL-REJECTED')
                                        .content("Sorry, your call to " + easyrtc.idToName(caller) + " was rejected")
                                        .ok('Ok')
                                        .targetEvent(event)
                                );
                                $rootScope.person = '';
								easyrtc.getLocalStream().stop();
								$rootScope.stopTimer();
                                $state.go("contacts");
                            }
                        };
                        var successCB = function() {
                        };
                        var failureCB = function() {
                        };
                         easyrtc.call($rootScope.person.name, successCB, failureCB, acceptedCB);
                    },
                    function(errorCode, errmesg){
                        easyrtc.showError(errorCode, errmesg);
                    }  // failure callback
                );
            };


            $scope.next = function() {
                $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
            };

            $scope.previous = function() {
                $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
            };


        }
    ]);

'use strict';

angular
    .module('core')
    .controller('HomeController', ['$rootScope', '$state', 'Users', '$http', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$mdDialog', '$cordovaGeolocation', '$cordovaCamera', '$stateParams', '$interval',
        function ($rootScope, $state, Users, $http, $timeout, $mdSidenav, $mdUtil, $log, $mdDialog, $cordovaGeolocation, $cordovaCamera, $stateParams, $interval) {

            $rootScope.phonenumber = $stateParams.phonenumber;
			
			
			
			document.addEventListener('deviceready', function () {
    cordova.plugins.backgroundMode.setDefaults({ 
	title:  'Goblob',
    ticker: 'Goblob',
    text:   'Goblob'
	}
	);
    cordova.plugins.backgroundMode.enable();
    cordova.plugins.backgroundMode.onactivate = function () {
        setTimeout(function () {
            cordova.plugins.backgroundMode.configure({
				title: 'Goblob',
                text:'Running in background.'
            });
        }, 5000);
    }
	
	

}, false);




document.addEventListener("resume", function() {
    if (cordova.backgroundapp.resumeType == 'normal-launch') {
		
    } else if (cordova.backgroundapp.resumeType == 'programmatic-launch') {
		
    }
}, false);

			
			

            $rootScope.people = [];

            var callinprogress = false;

            if ($rootScope.phonenumber) {

                var SERVER_IP = 'goblob.com';
                var SERVER_PORT = 443;

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


                $state.go("contacts");
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
                $state.go("register");
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



'use strict';

angular
    .module('register')
    .controller('RegisterController', [
        '$scope', 'Profiles', '$state', '$rootScope',
        function($scope, Profiles, $state, $rootScope) {

    $scope.createUser = function() {

    	$rootScope.db.transaction(function(tx) {
			    $rootScope.db.executeSql("pragma table_info (profile_table);", [], function(res) {
			      console.log("PRAGMA res: " + JSON.stringify(res));
			    });

			    tx.executeSql("INSERT INTO profile_table (id, profile_name, profile_status) VALUES (?, ?,?);", [1, $scope.username, "online"], function(tx, res) {
			      $state.go("home", {phonenumber:$scope.username});
			    }, function(e) {
			      console.log("ERROR: " + e.message);
			    });
			  });

        

    }

}]);

'use strict';

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

'use strict';

angular
    .module('videocall')
    .controller('VideocallController', [
        '$scope', '$rootScope', '$state',
        function($scope, $rootScope, $state) {

            if(!$rootScope.phonenumber) {
                $state.go("register");
            }

            $rootScope.timeToMissing();

            $rootScope.video = document.getElementById('box1');
            $rootScope.selfVideo = document.getElementById('box0');
            $rootScope.fullpage = document.getElementById('fullpage');

            $scope.hangup = function(event) {
                easyrtc.hangupAll();
                $rootScope.stopTimer();
				if($rootScope.video.style.visibility != "visible")
					easyrtc.question($rootScope.person.name, {call: 'missing'});
                if(easyrtc.getLocalStream())
                    easyrtc.getLocalStream().stop();
                $state.go("contacts");
            }


            var reshapeThumbs = [
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();

                    if( activeBox > 0 ) {
                        return setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
                    }
                    else {
                        setSharedVideoSize(parentw, parenth);
                        switch(connectCount) {
                            case 0:return reshapeToFullSize(parentw, parenth);
                            case 1:return reshape1of2(parentw, parenth);
                            case 2:return reshape1of3(parentw, parenth);
                            case 3:return reshape1of4(parentw, parenth);
                        }
                    }
                },
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();
                    if( activeBox >= 0 || !boxUsed[1]) {
                        return setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
                    }
                    else{
                        switch(connectCount) {
                            case 1:
                                return reshape2of2(parentw, parenth);
                            case 2:
                                return reshape2of3(parentw, parenth);
                            case 3:
                                return reshape2of4(parentw, parenth);
                        }
                    }
                },
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();
                    if( activeBox >= 0 || !boxUsed[2] ) {
                        return setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
                    }
                    else  {
                        switch(connectCount){
                            case 1:
                                return reshape2of2(parentw, parenth);
                            case 2:
                                if( !boxUsed[1]) {
                                    return reshape2of3(parentw, parenth);
                                }
                                else {
                                    return reshape3of3(parentw, parenth);
                                }
                            case 3:
                                return reshape3of4(parentw, parenth);
                        }
                    }
                },
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();
                    if( activeBox >= 0 || !boxUsed[3]) {
                        return setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
                    }
                    else{
                        switch(connectCount){
                            case 1:
                                return reshape2of2(parentw, parenth);
                            case 2:
                                return reshape3of3(parentw, parenth);
                            case 3:
                                return reshape4of4(parentw, parenth);
                        }
                    }
                }
            ];



            setReshaper('fullpage', reshapeFull);
            for(var i = 0; i < numVideoOBJS; i++) {
                prepVideoBox(i);
            }

            window.onresize =  $rootScope.handleWindowResize;
            $rootScope.handleWindowResize();


            boxUsed[1] = true;
            if(activeBox === 0 &&  easyrtc.getConnectionCount() === 1) {
                collapseToThumb();
            }


            function collapseToThumb() {
                collapseToThumbHelper();
                activeBox = -1;
                $rootScope.handleWindowResize();
            }



            function expandThumb(whichBox) {
                var lastActiveBox = activeBox;
                if( activeBox >= 0 ) {
                    collapseToThumbHelper();
                }
                if( lastActiveBox !== whichBox) {
                    var id = getIdOfBox(whichBox);
                    activeBox = whichBox;
                    setReshaper(id, reshapeToFullSize);
                    document.getElementById(id).style.zIndex = 1;
                    if( whichBox > 0) {
                    }
                }
                $rootScope.handleWindowResize();
            }



            function reshapeFull(parentw, parenth) {
                return {
                    left:0,
                    top:0,
                    width:parentw,
                    height:parenth-100
                };
            }


            var margin = 20;

            function reshapeToFullSize(parentw, parenth) {
                var left, top, width, height;
                var margin= 20;

                if( parentw < parenth*aspectRatio){
                    width = parentw -margin;
                    height = width/aspectRatio;
                }
                else {
                    height = parenth-margin;
                    width = height*aspectRatio;
                }
                left = (parentw - width)/2;
                top = (parenth - height)/2;
                return {
                    left:left,
                    top:top,
                    width:width,
                    height:height
                };
            }

            function setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {

                var width, height;
                if( parentw < parenth*aspectRatio){
                    width = parentw * percentSize;
                    height = width/aspect;
                }
                else {
                    height = parenth * percentSize;
                    width = height*aspect;
                }
                var left;
                if( percentLeft < 0) {
                    left = parentw - width;
                }
                else {
                    left = 0;
                }
                left += Math.floor(percentLeft*parentw);
                var top = 0;
                if( percentTop < 0) {
                    top = parenth - height;
                }
                else {
                    top = 0;
                }
                top += Math.floor(percentTop*parenth);
                return {
                    left:left,
                    top:top,
                    width:width,
                    height:height
                };
            }


            function setThumbSize(percentSize, percentLeft, percentTop, parentw, parenth) {
                return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspectRatio);
            }

            function setThumbSizeButton(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
                return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
            }


            var sharedVideoWidth  = 1;
            var sharedVideoHeight = 1;

            function reshape1of2(parentw, parenth) {
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*2)/3,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3,
                        top:  (parenth -sharedVideoHeight)/2,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }



            function reshape2of2(parentw, parenth){
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*2)/3 *2 + sharedVideoHeight,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3 *2 + sharedVideoWidth,
                        top:  (parenth -sharedVideoHeight)/2,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }

            function reshape1of3(parentw, parenth) {
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*3)/4 ,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3,
                        top:  (parenth -sharedVideoHeight*2)/3,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }

            function reshape2of3(parentw, parenth){
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*3)/4*2+ sharedVideoHeight,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3*2+sharedVideoWidth,
                        top:  (parenth -sharedVideoHeight*2)/3,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }

            function reshape3of3(parentw, parenth) {
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*3)/4*3+ sharedVideoHeight*2,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3*1.5+sharedVideoWidth/2,
                        top:  (parenth -sharedVideoHeight*2)/3*2+ sharedVideoHeight,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }


            function reshape1of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3,
                    top: (parenth - sharedVideoHeight*2)/3,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }

            function reshape2of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3*2+ sharedVideoWidth,
                    top: (parenth - sharedVideoHeight*2)/3,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }

            function reshape3of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3,
                    top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }

            function reshape4of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
                    top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }


            function setSharedVideoSize(parentw, parenth) {
                layout = ((parentw /aspectRatio) < parenth)?'p':'l';
                var w, h;

                function sizeBy(fullsize, numVideos) {
                    return (fullsize - margin*(numVideos+1) )/numVideos;
                }

                connectCount = easyrtc.getConnectionCount();

                switch(layout+(connectCount+1)) {
                    case 'p1':
                    case 'l1':
                        w = sizeBy(parentw, 1);
                        h = sizeBy(parenth, 1);
                        break;
                    case 'l2':
                        w = sizeBy(parentw, 2);
                        h = sizeBy(parenth, 1);
                        break;
                    case 'p2':
                        w = sizeBy(parentw, 1);
                        h = sizeBy(parenth, 2);
                        break;
                    case 'p4':
                    case 'l4':
                    case 'l3':
                        w = sizeBy(parentw, 2);
                        h = sizeBy(parenth, 2);
                        break;
                    case 'p3':
                        w = sizeBy(parentw, 1);
                        h = sizeBy(parenth, 3);
                        break;
                }
                sharedVideoWidth = Math.min(w, h * aspectRatio);
                sharedVideoHeight = Math.min(h, w/aspectRatio);
            }


            function setReshaper(elementId, reshapeFn) {
                var element = document.getElementById(elementId);
                if( !element) {
                    alert("Attempt to apply to reshapeFn to non-existent element " + elementId);
                }
                if( !reshapeFn) {
                    alert("Attempt to apply misnamed reshapeFn to element " + elementId);
                }
                element.reshapeMe = reshapeFn;
            }


            function collapseToThumbHelper() {
                if( activeBox >= 0) {
                    var id = getIdOfBox(activeBox);
                    document.getElementById(id).style.zIndex = 2;
                    setReshaper(id, reshapeThumbs[activeBox]);
                    activeBox = -1;
                }
            }



            function prepVideoBox(whichBox) {
                var id = getIdOfBox(whichBox);
                setReshaper(id, reshapeThumbs[whichBox]);
                document.getElementById(id).onclick = function() {
                    expandThumb(whichBox);
                };
            }

            function getIdOfBox(boxNum) {
                return "box" + boxNum;
            }


        }
]);

var activeBox = -1;  // nothing selected
var aspectRatio = 4/3;  // standard definition video aspect ratio
var maxCALLERS = 3;
var numVideoOBJS = maxCALLERS+1;
var layout;
var boxUsed = [true, false, false, false];
var connectCount = 0;

