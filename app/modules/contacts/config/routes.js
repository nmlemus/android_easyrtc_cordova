'use strict';

/**
* @ngdoc object
* @name contacts.config
* @requires ng.$stateProvider
* @description Defines the routes and other config within the contacts module
*/
angular
    .module('contacts')
    .config(['$stateProvider',
        function($stateProvider) {
            /**
             * @ngdoc event
             * @name contacts.config.route
             * @eventOf contacts.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the state is `'contacts'`, route to contacts
             *
            */
            $stateProvider
                .state('contacts', {
                    url: '/contacts',
                    templateUrl: 'modules/contacts/views/contacts.html',
                    controller: 'ContactsController'
                });
        }
    ]);
