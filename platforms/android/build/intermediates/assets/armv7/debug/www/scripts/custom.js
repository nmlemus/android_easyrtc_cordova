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
    .registerModule('chat');

'use strict';

ApplicationConfiguration.registerModule('core');

'use strict';

ApplicationConfiguration
    .registerModule('register');

'use strict';

ApplicationConfiguration
    .registerModule('start');

'use strict';

angular
    .module('chat')
    .config(['$stateProvider',
        function($stateProvider) {
                        $stateProvider
                .state('chatroutes', {
                    url: '/chatroutes',
                    templateUrl: 'modules/chat/views/chatroutes.html',
                    controller: 'ChatroutesController'
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
angular.module('core').factory('Users', ['$resource',
    function($resource) {
        return $resource('http://10.0.0.108:3000/profiles', null, {
        	'update': {method: 'PUT'}});
    }
]);
'use strict';

angular
    .module('register')
    .factory('Profiles', ['$resource',
        function($resource) {
            return $resource('https://10.0.0.108:3000/userused', {}, {update: {method: 'PUT'}});    
        }
    ]);
'use strict';

angular
    .module('chat')
    .controller('ChatroutesController', [
        '$scope',
        function($scope) {


        }
]);

'use strict';

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



'use strict';

angular
    .module('core')
    .controller('HomeController', ['$scope', '$state', 'Users', '$http', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$mdDialog', '$cordovaGeolocation', '$cordovaCamera','$stateParams', '$interval',
        function($scope, $state, Users, $http, $timeout, $mdSidenav, $mdUtil, $log, $mdDialog, $cordovaGeolocation, $cordovaCamera, $stateParams, $interval) {
            $scope.toggleLeft = buildToggler('left');
            $scope.toggleRight = buildToggler('right');
            

            $scope.viewcontact = 'block';
            $scope.viewchat = 'none';
            $scope.viewcall = 'none';

            $scope.people = [];

            var timer;

            var phonenumber = $stateParams.phonenumber;

            if(phonenumber) {

                var SERVER_IP = '10.0.0.108';
                var SERVER_PORT = 3000;

                easyrtc.setSocketUrl("https://" + SERVER_IP + ":" + SERVER_PORT, {
                    host: SERVER_IP
                    , secure: true
                    , port: SERVER_PORT
                });

                easyrtc.setUsername(phonenumber);

                easyrtc.setRoomOccupantListener(convertListToButtons);

                easyrtc.connect("easyrtc.instantMessaging", loginSuccess, loginFailure);
            }else{
                $state.go("register");
            }


                function time(input)
                {
                    function z(n) {return (n<10? '0' : '') + n;}
                    var seconds = input % 60;
                    var minutes = Math.floor(input / 60);
                    var hours = Math.floor(minutes / 60);
                    if(hours==0 && minutes==0)
                       return z(seconds);
                    if(hours==0)
                        return z(minutes)+':'+z(seconds);
                    return (z(hours) +':'+z(minutes)+':'+z(seconds));
                };



            function convertListToButtons (roomName, occupants, isPrimary) {
                var s = [];
                var tmp = $scope.people;
                $scope.people = [];
                for(var easyrtcid in occupants) {
                    easyrtc.getUser(easyrtcid,
                        function(msgType, msgData){
                            if(msgData){
                                var id = findID(msgData.profile_name, tmp);
                                var msg = [];
                                var newMessage = 'none';
                                var notification_count = 0;
                                if(id!=-1){
                                    msg = tmp[id].messages;
                                    newMessage = tmp[id].newMessage;
                                    notification_count = tmp[id].notification_count;
                                }
                                $scope.people[$scope.people.length] = { name: msgData.profile_name, img: 'img/ic_account_circle_128.png', newMessage: newMessage , profile_status: msgData.profile_status, messages:msg, notification_count:notification_count};
                                if (!$scope.$$phase)
                                    $scope.$apply();
                            }
                        },
                        function(errorCode, errorText){
                            easyrtc.showError(errorCode, errorText);
                        }
                    );
                }
                if (!$scope.$$phase)
                    $scope.$apply();
            }
            function loginSuccess(easyrtcid) {
                console.log("logged in");
                easyrtc.getUser(easyrtcid,
                    function(msgType, msgData){
                        if(!msgData){
                            easyrtc.createUser(easyrtcid,
                                function(msgType, msgData){
                                    easyrtc.updateStatus(easyrtcid, "online",
                                        function(msgType, msgData){

                                        },
                                        function(errorCode, errorText){
                                            easyrtc.showError(errorCode, errorText);
                                        }
                                    );
                                },
                                function(errorCode, errorText){
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
                    function(errorCode, errorText){
                        easyrtc.showError(errorCode, errorText);
                    }
                );
            }

            easyrtc.setDisconnectListener(function () {
                easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
            });

            function loginFailure(errorCode, message) {
                console.log("disconnected");
            }


            $scope.prueba = function(){
                $scope.person = 'prueba';
                $scope.viewcontact = 'none';
                $scope.viewchat = 'block';
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
                }
            }


            $scope.hangup = function(event) {
                easyrtc.hangupAll();
                $scope.viewcontact = 'block';
                $scope.viewcall = 'none';
                $interval.cancel(timer);
                $scope.timercount = '';
            }


            $scope.openChat = function(event, person) {
               /* $mdDialog.show(
                    $mdDialog.alert()
                        .title('Secondary Action')
                        .content('Secondary actions can be used for one click actions')
                        .ariaLabel('Secondary click demo')
                        .ok('Neat!')
                        .targetEvent(event)
                );*/
                $scope.person = person;
                person.newMessage = 'none';
                person.notification_count = 0;
                $scope.viewcontact = 'none';
                $scope.viewchat = 'block';
            };



            easyrtc.setAcceptChecker(function(easyrtcid, callback) {
                var s = "Accept incoming call from " + easyrtcid + " ?";
                if( easyrtc.getConnectionCount() > 0 ) {
                    s = "Drop current call and accept new from " + easyrtcid + " ?";
                }
                var confirm = $mdDialog.confirm()
                    .title('Accept call')
                    .content(s)
                    .ok('Accept')
                    .cancel('Cancel')

                $mdDialog.show(confirm).then(function() {
                    easyrtc.enableVideo(false);
                    easyrtc.enableVideoReceive(false);
                    $scope.person = $scope.people[findID(easyrtcid, $scope.people)];
                    $scope.viewcontact = 'none';
                    $scope.viewcall = 'block';
                    acceptTheCall(true);
                }, function() {
                    acceptTheCall(false);
                });

                var acceptTheCall = function(wasAccepted) {
                    if( wasAccepted && easyrtc.getConnectionCount() > 0 ) {
                        easyrtc.hangupAll();
                    }
                    callback(wasAccepted);
                };
            } );


            easyrtc.setStreamAcceptor( function(easyrtcid, stream) {
                var audio = document.getElementById('callerAudio');
                easyrtc.setVideoObjectSrc(audio,stream);
                var seconds = 0;
                timer = $interval(function(){
                    seconds++;
                    $scope.timercount =time(seconds);
                    console.log(time(seconds));
                }, 1000);
            });


            easyrtc.setOnStreamClosed( function (easyrtcid) {
                easyrtc.setVideoObjectSrc(document.getElementById('callerAudio'), "");
                $scope.viewcontact = 'block';
                $scope.viewcall = 'none';
                $interval.cancel(timer);
                $scope.timercount = '';
                if (!$scope.$$phase)
                    $scope.$apply();
            });


            $scope.call = function(event, person) {
                $scope.person = person;
                $scope.viewcontact = 'none';
                $scope.viewcall = 'block';
                easyrtc.enableVideo(false);
                easyrtc.enableVideoReceive(false);
                easyrtc.initMediaSource(
                    function(){        // success callback
                    },
                    function(errorCode, errmesg){
                        easyrtc.showError(errorCode, errmesg);
                    }  // failure callback
                );

                var acceptedCB = function(accepted, caller) {
                    if( !accepted ) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .title('CALL-REJECTED')
                                .content("Sorry, your call to " + easyrtc.idToName(caller) + " was rejected")
                                .ok('Ok')
                                .targetEvent(event)
                        );
                        $scope.viewcall = 'none';
                        $scope.viewcontact = 'block';
                    }
                };
                var successCB = function() {
                };
                var failureCB = function() {
                };
                easyrtc.call(person.name, successCB, failureCB, acceptedCB);
            };

            $scope.back = function(){
                $scope.viewcontact = 'block';
                $scope.viewchat = 'none';
                $scope.person = '';
            }

            $scope.next = function() {
                $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
            };

            $scope.previous = function() {
                $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
            };


            function buildToggler(navID) {
                var debounceFn =  $mdUtil.debounce(function(){
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                },300);
                return debounceFn;
            }



            easyrtc.setPeerListener(messageListener);

            function findID(id, people){
                for(var i = 0; i< people.length; i++){
                    if(people[i].name==id)
                        return i;
                }
                return -1;
            }

            function messageListener(easyrtcid, msgType, content) {
                var id = findID(easyrtcid, $scope.people);
                if(id!=-1){
                $scope.$apply(function () {
                    $scope.people[id].messages[$scope.people[id].messages.length] = {
                        username: easyrtcid,
                        text: content,
                        timestamp: new Date().toISOString()
                    };
                    if(!$scope.person || $scope.person.name != easyrtcid){
                        $scope.people[id].newMessage = 'block';
                        $scope.people[id].notification_count++;
                    }
                });
                }
            }



            $scope.send = function(){
                var stringToSend = document.getElementById('message').value;
                if (stringToSend && stringToSend != "" && stringToSend != "\n") {
                    if (easyrtc.lost_connection[$scope.person.name]) {
                        easyrtc.sendDataP2P($scope.person.name, "message", stringToSend);
                    }
                    else {
                        easyrtc.sendDataWS($scope.person.name, "message", stringToSend);
                    }
                    $scope.person.messages[$scope.person.messages.length] = {
                        username: "Me",
                        text: stringToSend,
                        timestamp: new Date().toISOString()
                    };
                }


                var inputMsg = document.getElementById('message');
                inputMsg.value = "";
                inputMsg.focus();
            }

        }
    ]);



'use strict';

angular
    .module('register')
    .controller('RegisterController', [
        '$scope', 'Profiles', '$state',
        function($scope, Profiles, $state) {

    $scope.createUser = function() {

               $state.go("home", {phonenumber:$scope.username});

    }

}]);

'use strict';

angular
    .module('start')
    .controller('StartRoutesController', [
        '$scope', '$state', '$cordovaPreferences', '$cordovaSQLite',
        function($scope, $state, $cordovaPreferences, $cordovaSQLite) {

        document.addEventListener('deviceready', onDeviceReady, false);

        function onDeviceReady() {
  			var db = window.sqlitePlugin.openDatabase({name: "goblob.db"});

			  db.transaction(function(tx) {
			     tx.executeSql('CREATE TABLE IF NOT EXISTS profile_table (id integer primary key, profile_name text, profile_status integer)');
			    db.executeSql("pragma table_info (profile_table);", [], function(res) {
			      console.log("PRAGMA res: " + JSON.stringify(res));
			    });

			    tx.executeSql("select count(id) as cnt from profile_table;", [], function(tx, res) {
			      console.log("res.rows.length: " + res.rows.length + " -- should be 1");
			      console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");

			      if (res.rows.item(0).cnt === 0){
			      	$state.go("register");	
			      }else{
			      	$state.go("home");
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
