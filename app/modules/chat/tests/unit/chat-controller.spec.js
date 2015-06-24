'use strict';

describe('Controller: ChatController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('chat'));

    var ChatController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        ChatController = $controller('ChatController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
