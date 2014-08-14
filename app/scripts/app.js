(function () {
	'use strict';

	var snakeApp = angular.module('snakeApp', [
		'ngRoute',
		'ngTouch',

		'snakeScreen',
		'snakeGame',
		'snakeLogin'
	]);

	snakeApp.config(['$routeProvider', 
		function ($routeProvider) {
			$routeProvider
				.when('/login/:menuItem', {
					templateUrl: 'views/login.html'
				})
				.when('/game/:menuItem', {
					templateUrl: 'views/screen.html'
				})
				.otherwise({
					redirectTo: '/game/settings',
				});
		}
	]);

	snakeApp.controller('AppCtrl', ['$scope', '$rootScope', '$route',
		function ($scope, $rootScope, $route) {
			$rootScope.getActiveItem = function (menu) {
				var menuItem = $route.current.params.menuItem,
					isFound = false,
					screenNum = 0;

				for ( var i = 0; i < menu.length; i++ ) {
					if ( !isFound && menu[i].url === menuItem ) {
						isFound = true;
						screenNum = i;
					}
					else {
						menu[i].isActive = false;
					}
				}

				return screenNum;
			}

			$rootScope.setActiveScreen = function () {
				// body...
			}
		}
	]);

	snakeApp.directive('ngMatch', ['$parse', function ($parse) {
 
		var directive = {
			link: link,
			restrict: 'A',
			require: '?ngModel'
		};
		return directive;
 
		function link(scope, elem, attrs, ctrl) {
			// if ngModel is not defined, we don't need to do anything
			if (!ctrl) return;
			if (!attrs['ngMatch']) return;
	 
			var firstPassword = $parse(attrs['ngMatch']);
	 
			var validator = function (value) {
				var temp = firstPassword(scope),
				v = value === temp;
				ctrl.$setValidity('match', v);
				return value;
			}
	 
			ctrl.$parsers.unshift(validator);
			ctrl.$formatters.push(validator);
			attrs.$observe('ngMatch', function () {
				validator(ctrl.$viewValue);
			});
		}
	}]);


})();