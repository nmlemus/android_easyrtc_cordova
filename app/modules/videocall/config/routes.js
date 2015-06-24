'use strict';

/**
* @ngdoc object
* @name videocall.config
* @requires ng.$stateProvider
* @description Defines the routes and other config within the videocall module
*/
angular
    .module('videocall')
    .config(['$stateProvider',
        function($stateProvider) {
            /**
             * @ngdoc event
             * @name videocall.config.route
             * @eventOf videocall.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the state is `'videocall'`, route to videocall
             *
            */
            $stateProvider
                .state('videocall', {
                    url: '/videocall',
                    templateUrl: 'modules/videocall/views/videocall.html',
                    controller: 'VideocallController'
                });
        }
    ]);
