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
								var movePos = current.x - start.x,
									width = el[0].offsetWidth,
									itemWidth = (movePos > 0) ? scope.menu[0].style.width : scope.menu[1].style.width;

								scope.navStyle['margin-left'] = (movePos) / width * parseInt(itemWidth) + 'px';
								scope.ctrl.screenStyle['margin-left'] = (movePos) + 'px';
							});
						},
						function (start, end) {
							scope.$apply(function () {
								var width = el[0].offsetWidth,
									movePos = end.x - start.x,
									itemWidth = (movePos > 0) 
													? parseInt(scope.menu[0].style.width)
													: -parseInt(scope.menu[1].style.width);

								if ( Math.abs(movePos) * 3 > width ) {
									TweenLite.to( element[0], 0.2, { 
										css: { marginLeft: width * movePos / Math.abs(movePos) },
										onComplete: function () {
											scope.$apply(function () {
												var marginOffset = -width;

												if (movePos > 0) {
													scope.menu.push(scope.menu.shift());
												}
												else {
													scope.menu.unshift(scope.menu.pop());
													marginOffset = width
												}

												TweenLite.fromTo(element[0], 0.2, {
													css: {
														marginLeft: marginOffset
													}
												}, {
													css: {
														marginLeft: 0
													},
													onComplete: function () {
														scope.ctrl.screenStyle['margin-left'] = '0px';
													}
												});
												
											});
										}
									});
									TweenLite.to( '#main-nav ul', 0.2, { 
										css: { marginLeft: itemWidth },
										onComplete: function () {
											scope.$apply(function () {
												scope.navStyle['transform'] = 'translateX(-' + scope.menu[0].style.width + ')';
												scope.navStyle['margin-left'] = '0px';
											});

										}
									});
								}
								else {
									TweenLite.to( element[0], 0.2, { css: { marginLeft: 0 } });
									TweenLite.to( '#main-nav ul', 0.2, { css: { marginLeft: 0 } });
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