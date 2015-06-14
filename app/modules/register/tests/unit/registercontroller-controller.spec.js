'use strict';

describe('Controller: RegistercontrollerController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('register'));

    var RegistercontrollerController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        RegistercontrollerController = $controller('RegistercontrollerController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
