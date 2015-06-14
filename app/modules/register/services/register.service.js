'use strict';

/**
 * @ngdoc service
 * @name register.Services.Registerservice
 * @description Registerservice Factory
 */
angular
    .module('register')
    .factory('Profiles', ['$resource',
        function($resource) {
            return $resource('https://goblob.com/userused', {}, {update: {method: 'PUT'}});    
        }
    ]);