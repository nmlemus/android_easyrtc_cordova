'use strict';

//Rooms service used to communicate Rooms REST endpoints
angular.module('core').factory('Users', ['$resource',
    function($resource) {
        return $resource('https://goblob.com/profiles', null, {
        	'update': {method: 'PUT'}});
    }
]);