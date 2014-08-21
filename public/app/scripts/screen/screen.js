(function () {
	'use strict';

	var screen = angular.module('snakeScreen', []);

	screen.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
	    var original = $location.path;
	    $location.path = function (path, reload) {
	        if (reload === false) {
	            var lastRoute = $route.current;
	            var un = $rootScope.$on('$locationChangeSuccess', function () {
	                $route.current = lastRoute;
	                un();
	            });
	        }
	        return original.apply($location, [path]);
	    };
	}]);

	screen.factory('screenData', ['$swipe', '$route', '$location',
		function ($swipe, $route, $location) {
			return {
				screenStyle: {
					'margin-left': '0px'			
				},
				setActive: function (menu) {
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
									menu.concat(menu.splice(0, i - 1));
									break;
							}

							break;
						}
					}
				},
				onSwipe: function (element, callback) {
					var start;

					if ( element[0]['swipe'] == undefined ) {
						$swipe.bind(element, {
							start: function(coords) {
								start = coords;
								( callback[0] ) && callback[0](start, coords);
							},
							move: function (coords) {
								if ( element[0]['swipe'] ) {
									( callback[0] ) && callback[0](start, coords);
								}
							},
							end: function (coords) {
								if ( element[0]['swipe'] ) {
									( callback[1] ) && callback[1](start, coords);
								}
							},
							cancel: function (coords) {

							}
						});
					}

					element[0]['swipe'] = true;
				},
				offSwipe: function (element) {
					element[0]['swipe'] = false;
				},
				setUrl: function (url) {
					$location.path($location.path().match(/\/\w+\//)[0] + url, false);				
				}
			}
		}
	]);

	screen.controller('ScreenCtrl', ['$scope', 'screenData',
		function ($scope, screenData) {
			this.screenStyle = screenData.screenStyle;
		}
	]);

	screen.directive('screenWrapper', ['screenData',
		function (screenData) {
			return {
				restrict: 'E',
				replace: true,
				transclude: true,
				templateUrl: 'templates/screen.html',
				scope: {
					menu: '=',
					navStyle: '='
				},
				link: function (scope, element, attrs) {
					var el = element.parent();

					screenData.setActive(scope.menu);
					scope.navStyle['transform'] = 'translateX(-' + scope.menu[0].style.width + ')';

					screenData.onSwipe(el, 
						[
							function (start, current) {
								scope.$apply(function () {
									var movePos = current.x - start.x,
										width = el[0].offsetWidth,
										itemWidth = (movePos > 0) ? scope.menu[0].style.width : scope.menu[1].style.width;

									scope.navStyle['margin-left'] = (movePos) / width * parseInt(itemWidth) + 'px';
									screenData.screenStyle['margin-left'] = (movePos) + 'px';
								});
							},
							function (start, end) {
								scope.$apply(function () {
									var width = el[0].offsetWidth,
										movePos = end.x - start.x,
										itemWidth = (movePos > 0) 
														? parseInt(scope.menu[0].style.width)
														: -parseInt(scope.menu[1].style.width);

									if ( Math.abs(movePos) * 4 > width ) {
										TweenLite.to( element[0], 0.2, { 
											css: { marginLeft: width * movePos / Math.abs(movePos) },
											onComplete: function () {
												scope.$apply(function () {
													var marginOffset = -width;

													if (movePos > 0) {
														scope.menu.unshift(scope.menu.pop());
													}
													else {
														scope.menu.push(scope.menu.shift());
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
															screenData.screenStyle['margin-left'] = '0px';
														}
													});

													screenData.setUrl(scope.menu[1].url)
													
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
		}
	]);

	screen.directive('wpSelect', function () {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/select.html',
			scope: {
				model: '=',
				options: '='
			},
			link: function (scope, element, attrs) {
				element.children().css({
					'margin-top': -20 * scope.model + 'px'
				});

				element.on('click', function () {
					if ( !element.hasClass('no-clickable') ) {					
						var optionsNum = element.children().children().length;
						element
							.addClass('expanded')
							.addClass('no-clickable');

						TweenLite.to(element[0], 0.4, {
							css: { height: 4 + 35 * optionsNum } 
						});

						TweenLite.to(element.children()[0], 0.4, {
							css: { marginTop: 0 } 
						});
					}
				});
			},
			controller: ['$scope', function ($scope) {
				this.setModel = function (value) {
					$scope.$apply(function () {
						$scope.model = value;
					});
				}
			}]
		};
	});

	screen.directive('wpOption', function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			require: '^wpSelect',
			templateUrl: 'templates/option.html',
			scope: {
				option: '='
			},
			link: function (scope, element, attrs, selectCtrl) {
				var	wpSelect = element.parent(),
					wpSelectWrapper = wpSelect.parent();

				element.on('click', function () {
					if ( wpSelectWrapper.hasClass('expanded') ) {

						selectCtrl.setModel(scope.option.number)				

						wpSelectWrapper.removeClass('expanded');
						
						TweenLite.to(wpSelectWrapper, 0.4, {
							css: { height: 24 },
							onComplete: function () {
								wpSelectWrapper.removeClass('no-clickable');
							}
						});

						TweenLite.to(wpSelect, 0.4, {
							css: { marginTop: -20 * scope.option.number }
						});
					}
				});
			}
		}
	});
})();