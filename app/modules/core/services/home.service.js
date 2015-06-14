'use strict';

//Rooms service used to communicate Rooms REST endpoints
angular.module('core').factory('Users', ['$resource',
    function($resource) {
        return $resource('http://10.0.0.108:3000/profiles', null, {
        	'update': {method: 'PUT'}});
    }
]);