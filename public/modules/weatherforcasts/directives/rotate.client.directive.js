'use strict';

angular.module('weatherforcasts').directive('rotate',
    function() {
       return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.degrees, function (rotateDegrees) {
                var r = 'rotate(' + rotateDegrees + 'deg)';
                element.css({
                    '-moz-transform': r,
                    '-webkit-transform': r,
                    '-o-transform': r,
                    '-ms-transform': r
                });
            });
        }
    };
    }
    );