'use strict';

/**
 * @ngdoc object
 * @name videocall.Controllers.VideocallController
 * @description VideocallController
 * @requires ng.$scope
*/
angular
    .module('videocall')
    .controller('VideocallController', [
        '$scope', '$rootScope', '$state',
        function($scope, $rootScope, $state) {

            if(!$rootScope.phonenumber) {
                $state.go("register");
            }

            $rootScope.timeToMissing();

            $rootScope.video = document.getElementById('box1');
            $rootScope.selfVideo = document.getElementById('box0');
            $rootScope.fullpage = document.getElementById('fullpage');

            $scope.hangup = function(event) {
                easyrtc.hangupAll();
                $rootScope.stopTimer();
				if($rootScope.video.style.visibility != "visible")
					easyrtc.question($rootScope.person.name, {call: 'missing'});
                if(easyrtc.getLocalStream())
                    easyrtc.getLocalStream().stop();
                $state.go("contacts");
            }


            var reshapeThumbs = [
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();

                    if( activeBox > 0 ) {
                        return setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
                    }
                    else {
                        setSharedVideoSize(parentw, parenth);
                        switch(connectCount) {
                            case 0:return reshapeToFullSize(parentw, parenth);
                            case 1:return reshape1of2(parentw, parenth);
                            case 2:return reshape1of3(parentw, parenth);
                            case 3:return reshape1of4(parentw, parenth);
                        }
                    }
                },
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();
                    if( activeBox >= 0 || !boxUsed[1]) {
                        return setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
                    }
                    else{
                        switch(connectCount) {
                            case 1:
                                return reshape2of2(parentw, parenth);
                            case 2:
                                return reshape2of3(parentw, parenth);
                            case 3:
                                return reshape2of4(parentw, parenth);
                        }
                    }
                },
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();
                    if( activeBox >= 0 || !boxUsed[2] ) {
                        return setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
                    }
                    else  {
                        switch(connectCount){
                            case 1:
                                return reshape2of2(parentw, parenth);
                            case 2:
                                if( !boxUsed[1]) {
                                    return reshape2of3(parentw, parenth);
                                }
                                else {
                                    return reshape3of3(parentw, parenth);
                                }
                            case 3:
                                return reshape3of4(parentw, parenth);
                        }
                    }
                },
                function(parentw, parenth) {
                    connectCount = easyrtc.getConnectionCount();
                    if( activeBox >= 0 || !boxUsed[3]) {
                        return setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
                    }
                    else{
                        switch(connectCount){
                            case 1:
                                return reshape2of2(parentw, parenth);
                            case 2:
                                return reshape3of3(parentw, parenth);
                            case 3:
                                return reshape4of4(parentw, parenth);
                        }
                    }
                }
            ];



            setReshaper('fullpage', reshapeFull);
            for(var i = 0; i < numVideoOBJS; i++) {
                prepVideoBox(i);
            }

            window.onresize =  $rootScope.handleWindowResize;
            $rootScope.handleWindowResize();


            boxUsed[1] = true;
            if(activeBox === 0 &&  easyrtc.getConnectionCount() === 1) {
                collapseToThumb();
            }


            function collapseToThumb() {
                collapseToThumbHelper();
                activeBox = -1;
                $rootScope.handleWindowResize();
            }



            function expandThumb(whichBox) {
                var lastActiveBox = activeBox;
                if( activeBox >= 0 ) {
                    collapseToThumbHelper();
                }
                if( lastActiveBox !== whichBox) {
                    var id = getIdOfBox(whichBox);
                    activeBox = whichBox;
                    setReshaper(id, reshapeToFullSize);
                    document.getElementById(id).style.zIndex = 1;
                    if( whichBox > 0) {
                    }
                }
                $rootScope.handleWindowResize();
            }



            function reshapeFull(parentw, parenth) {
                return {
                    left:0,
                    top:0,
                    width:parentw,
                    height:parenth-100
                };
            }


            var margin = 20;

            function reshapeToFullSize(parentw, parenth) {
                var left, top, width, height;
                var margin= 20;

                if( parentw < parenth*aspectRatio){
                    width = parentw -margin;
                    height = width/aspectRatio;
                }
                else {
                    height = parenth-margin;
                    width = height*aspectRatio;
                }
                left = (parentw - width)/2;
                top = (parenth - height)/2;
                return {
                    left:left,
                    top:top,
                    width:width,
                    height:height
                };
            }

            function setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {

                var width, height;
                if( parentw < parenth*aspectRatio){
                    width = parentw * percentSize;
                    height = width/aspect;
                }
                else {
                    height = parenth * percentSize;
                    width = height*aspect;
                }
                var left;
                if( percentLeft < 0) {
                    left = parentw - width;
                }
                else {
                    left = 0;
                }
                left += Math.floor(percentLeft*parentw);
                var top = 0;
                if( percentTop < 0) {
                    top = parenth - height;
                }
                else {
                    top = 0;
                }
                top += Math.floor(percentTop*parenth);
                return {
                    left:left,
                    top:top,
                    width:width,
                    height:height
                };
            }


            function setThumbSize(percentSize, percentLeft, percentTop, parentw, parenth) {
                return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspectRatio);
            }

            function setThumbSizeButton(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
                return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
            }


            var sharedVideoWidth  = 1;
            var sharedVideoHeight = 1;

            function reshape1of2(parentw, parenth) {
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*2)/3,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3,
                        top:  (parenth -sharedVideoHeight)/2,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }



            function reshape2of2(parentw, parenth){
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*2)/3 *2 + sharedVideoHeight,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3 *2 + sharedVideoWidth,
                        top:  (parenth -sharedVideoHeight)/2,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }

            function reshape1of3(parentw, parenth) {
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*3)/4 ,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3,
                        top:  (parenth -sharedVideoHeight*2)/3,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }

            function reshape2of3(parentw, parenth){
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*3)/4*2+ sharedVideoHeight,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3*2+sharedVideoWidth,
                        top:  (parenth -sharedVideoHeight*2)/3,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }

            function reshape3of3(parentw, parenth) {
                if( layout=== 'p' ) {
                    return {
                        left: (parentw-sharedVideoWidth)/2,
                        top:  (parenth -sharedVideoHeight*3)/4*3+ sharedVideoHeight*2,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
                else {
                    return{
                        left: (parentw-sharedVideoWidth*2)/3*1.5+sharedVideoWidth/2,
                        top:  (parenth -sharedVideoHeight*2)/3*2+ sharedVideoHeight,
                        width: sharedVideoWidth,
                        height: sharedVideoHeight
                    };
                }
            }


            function reshape1of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3,
                    top: (parenth - sharedVideoHeight*2)/3,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }

            function reshape2of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3*2+ sharedVideoWidth,
                    top: (parenth - sharedVideoHeight*2)/3,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }

            function reshape3of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3,
                    top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }

            function reshape4of4(parentw, parenth) {
                return {
                    left: (parentw - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
                    top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
                    width: sharedVideoWidth,
                    height: sharedVideoHeight
                };
            }


            function setSharedVideoSize(parentw, parenth) {
                layout = ((parentw /aspectRatio) < parenth)?'p':'l';
                var w, h;

                function sizeBy(fullsize, numVideos) {
                    return (fullsize - margin*(numVideos+1) )/numVideos;
                }

                connectCount = easyrtc.getConnectionCount();

                switch(layout+(connectCount+1)) {
                    case 'p1':
                    case 'l1':
                        w = sizeBy(parentw, 1);
                        h = sizeBy(parenth, 1);
                        break;
                    case 'l2':
                        w = sizeBy(parentw, 2);
                        h = sizeBy(parenth, 1);
                        break;
                    case 'p2':
                        w = sizeBy(parentw, 1);
                        h = sizeBy(parenth, 2);
                        break;
                    case 'p4':
                    case 'l4':
                    case 'l3':
                        w = sizeBy(parentw, 2);
                        h = sizeBy(parenth, 2);
                        break;
                    case 'p3':
                        w = sizeBy(parentw, 1);
                        h = sizeBy(parenth, 3);
                        break;
                }
                sharedVideoWidth = Math.min(w, h * aspectRatio);
                sharedVideoHeight = Math.min(h, w/aspectRatio);
            }


            function setReshaper(elementId, reshapeFn) {
                var element = document.getElementById(elementId);
                if( !element) {
                    alert("Attempt to apply to reshapeFn to non-existent element " + elementId);
                }
                if( !reshapeFn) {
                    alert("Attempt to apply misnamed reshapeFn to element " + elementId);
                }
                element.reshapeMe = reshapeFn;
            }


            function collapseToThumbHelper() {
                if( activeBox >= 0) {
                    var id = getIdOfBox(activeBox);
                    document.getElementById(id).style.zIndex = 2;
                    setReshaper(id, reshapeThumbs[activeBox]);
                    activeBox = -1;
                }
            }



            function prepVideoBox(whichBox) {
                var id = getIdOfBox(whichBox);
                setReshaper(id, reshapeThumbs[whichBox]);
                document.getElementById(id).onclick = function() {
                    expandThumb(whichBox);
                };
            }

            function getIdOfBox(boxNum) {
                return "box" + boxNum;
            }


        }
]);

var activeBox = -1;  // nothing selected
var aspectRatio = 4/3;  // standard definition video aspect ratio
var maxCALLERS = 3;
var numVideoOBJS = maxCALLERS+1;
var layout;
var boxUsed = [true, false, false, false];
var connectCount = 0;

