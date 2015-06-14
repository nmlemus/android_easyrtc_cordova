'use strict';

/**
* @ngdoc object
* @name chat.config
* @requires ng.$stateProvider
* @description Defines the routes and other config within the chat module
*/
angular
    .module('chat')
    .config(['$stateProvider',
        function($stateProvider) {
            /**
             * @ngdoc event
             * @name chat.config.route
             * @eventOf chat.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the state is `'chatroutes'`, route to chatroutes
             *
            */
            $stateProvider
                .state('chatroutes', {
                    url: '/chatroutes',
                    templateUrl: 'modules/chat/views/chatroutes.html',
                    controller: 'ChatroutesController'
                });
        }
    ]);
