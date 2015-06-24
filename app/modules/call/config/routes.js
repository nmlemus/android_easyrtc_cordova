'use strict';

/**
* @ngdoc object
* @name call.config
* @requires ng.$stateProvider
* @description Defines the routes and other config within the call module
*/
angular
    .module('call')
    .config(['$stateProvider',
        function($stateProvider) {
            /**
             * @ngdoc event
             * @name call.config.route
             * @eventOf call.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the state is `'call'`, route to call
             *
            */
            $stateProvider
                .state('call', {
                    url: '/call',
                    templateUrl: 'modules/call/views/call.html',
                    controller: 'CallController'
                });
        }
    ]);
