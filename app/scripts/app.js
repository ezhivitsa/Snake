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
					redirectTo: function (routeParams, path, search) {
						switch( path ) {
							case '/login':
								return '/login/signin';
							case '/game':
								return '/game/settings';
							default:
								return '/game/settings';
						}
					}
				});
		}
	]);

	snakeApp.controller('AppCtrl', ['$scope', '$rootScope', '$route',
		function ($scope, $rootScope, $route) {
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

	snakeApp.directive('mySalutation',function(){
	    return {
	        restrict:'E',
	        scope:true,
	        replace:true,
	        transclude:true,
	        template:'<div>Hello<div class="transclude"></div></div>',
	        link: function (scope, element, attr,controller, linker) {
	           linker(scope, function(clone){
	                  element.find(".transclude").append(clone); // add to DOM
	           });
	        }
	    };
	})
	.controller('SalutationController',['$scope',function($scope){
	    this.target = "myStackOverflow";
	}])


})();