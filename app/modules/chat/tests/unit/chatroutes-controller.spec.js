'use strict';

describe('Controller: ChatroutesController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('chat'));

    var ChatroutesController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        ChatroutesController = $controller('ChatroutesController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
