(function () {
	'use strict';

	var screen = angular.module('snakeScreen', []);

	screen.controller('ScreenCtrl', ['$scope', '$swipe', '$route',
		function ($scope, $swipe, $route) {
			var self = this;

			self.screenStyle = {
				'margin-left': '0px'
			};

			self.setActive = function (menu) {
				var menuItem = $route.current.params.menuItem;

				for ( var i = 0; i < menu.length; i++ ) {
					if (  menu[i].url === menuItem ) {
						switch (i) {
							case 0:
								menu.unshift(menu.pop());
								break;
							case 1:
								break;
							default:
								menu.concat(menu.splice(0, i));
								break;
						}

						break;
					}
				}
			}

			self.onSwipe = function (element, callback) {
				var start;

				element['swipe'] = true;

				$swipe.bind(element, {
					start: function(coords) {
						start = coords;
						( callback[0] ) && callback[0](start, coords);
					},
					move: function (coords) {
						if ( element['swipe'] ) {
							( callback[0] ) && callback[0](start, coords);
						}
					},
					end: function (coords) {
						if ( element['swipe'] ) {
							( callback[1] ) && callback[1](start, coords);
						}
					},
					cancel: function (coords) {

					}
				});				
			}

			self.offSwipe = function (element) {
				element['swipe'] = false;
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
				menu: '=',
				ctrl: '=',
				navStyle: '='
			},
			link: function (scope, element, attrs) {
				var el = element.parent();

				scope.ctrl.setActive(scope.menu);
				scope.navStyle['transform'] = 'translateX(-' + scope.menu[0].style.width + ')';

				scope.ctrl.onSwipe(el, 
					[
						function (start, current) {
							scope.$apply(function () {
								var width = el[0].offsetWidth;

								scope.navStyle['margin-left'] = (current.x - start.x) / width * parseInt(scope.menu[1].style.width) + 'px';
								scope.ctrl.screenStyle['margin-left'] = (current.x - start.x) + 'px';
							});
						},
						function (start, end) {
							scope.$apply(function () {
								var width = el[0].offsetWidth;

								if ( Math.abs( end.x - start.x ) * 3 > width ) {
									//TweenLite.fromTo( el[0], 0.5, {} )
								}
							});
						}
					]
				);
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