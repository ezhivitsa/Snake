(function () {
	'use strict';

	var screen = angular.module('snakeScreen', []);

	screen.controller('ScreenCtrl', ['$scope', '$swipe', '$route',
		function ($scope, $swipe, $route) {
			var self = this,
				start;

			self.screenStyle = {
				'margin-left': '0px'
			};

			self.setActive = function (menu, active) {
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

				active = screenNum;
			}

			self.onSwipe = function () {
				$swipe.bind(element, {
					start: function(coords) {
						start = coords;
						scope.screenStyle['margin-left'] = 0 + 'px';
					},
					move: function (coords) {
						scope.screenStyle['margin-left'] = (coords.x - start.x) + 'px';
						console.log(scope)
						//console.log(coords.x - start.x)
					},
					end: function (coords) {
						console.log(coords);
					},
					cancel: function (coords) {

					}
				});				
			}

			self.offSwipe = function () {

			}
		}
	]);

	screen.directive('screenWrapper', function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: 'templates/screen.html',
			scope: {
				active: '=',
				menu: '=',
				ctrl: '='
			},
			link: function (scope, element, attrs) {
				scope.ctrl.setActive(scope.menu, scope.active);

				scope.ctrl.screenStyle['transform'] = 'translateX(' + ( -100 * scope.active ) + '%)';

				// setTimeout(function () {
				// 	scope.$apply(function () {
				// 		scope.active = 0;
				// 		scope.menu[0].isActive = true;
				// 		console.log('changed')
				// 		debugger
				// 	});
				// }, 1000);
			}
		};
	});

	screen.directive('screenItem', function () {
		return {
			restrict: 'E',
			require: 'screenWrapper',
			replace: true,
			transclude: true,
			template: '<div ng-transclude></div>'
		};
	});
})();