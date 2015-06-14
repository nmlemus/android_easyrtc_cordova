'use strict';

describe('Controller: StartroutesController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('start'));

    var StartroutesController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        StartroutesController = $controller('StartroutesController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
