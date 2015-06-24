'use strict';

describe('Controller: VideocallController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('videocall'));

    var VideocallController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        VideocallController = $controller('VideocallController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
