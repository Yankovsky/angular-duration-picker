angular.module('angularDurationPicker', [])
    .directive('timeDurationPicker', function($filter) {
        return {
            restrict: 'A',
            scope: {},
            require: '^ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function(modelValue) {
                    return $filter('timeDuration')(modelValue);
                });
                ngModelCtrl.$parsers.unshift(function(viewValue) {
                    // should support
                    // 12:59 -> 00:12:59
                    // 23 -> 00:00:23
                    // 1:23 -> 00:01:23
                    // 123 -> 1:23
                    // 1:1:1 -> 01:01:01
                    // 99 -> 00:00:59
                    // 99999:99:99 -> 99:59:59
                    // asfasf -> 00:00:00
                    var matches = viewValue.match(/^(\d{2}):([0-5]\d):([0-5]\d)$/);
                    if (matches) {
                        return +matches[1] * (60 * 60) + +matches[2] * 60 + +matches[3];
                    }
                });
            }
        }
    })
    .filter('timeDuration', function() {
        function secondsAsTime(seconds) {
            return [
                parseInt(seconds / (60 * 60)),
                parseInt((seconds % (60 * 60)) / 60),
                parseInt(seconds % 60)
            ]
        }

        function pad(number) {
            return number < 10 ? '0' + number : number;
        }

        return function(seconds) {
            return secondsAsTime(+seconds || 0).map(function(timeUnit) {
                return pad(timeUnit);
            }).join(':');
        }
    });