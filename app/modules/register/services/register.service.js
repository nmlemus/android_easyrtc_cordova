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
            return $resource('https://10.0.0.108:3000/userused', {}, {update: {method: 'PUT'}});    
        }
    ]);