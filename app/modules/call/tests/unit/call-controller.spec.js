'use strict';

describe('Controller: CallController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('call'));

    var CallController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        CallController = $controller('CallController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
