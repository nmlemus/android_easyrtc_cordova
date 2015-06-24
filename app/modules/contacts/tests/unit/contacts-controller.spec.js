'use strict';

describe('Controller: ContactsController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('contacts'));

    var ContactsController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        ContactsController = $controller('ContactsController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
