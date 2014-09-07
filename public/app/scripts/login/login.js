(function () {
	'use strict';

	var login = angular.module('snakeLogin', []);

	login.controller('LoginCtrl', ['$scope', '$rootScope',
		function ($scope, $rootScope) {
			this.menu = [
				{
					name: "registration",
					url: "registration",
					style: {
						width: '229px'
					}
				},
				{
					name: "sign in",
					url: "signin",
					style: {
						width: '143px'
					}
				},
				{
					name: "registration",
					url: "registration",
					style: {
						width: '229px'
					}
				},
				{
					name: "sign in",
					url: "signin",
					style: {
						width: '143px'
					}
				}
			];

			this.navStyle = {};
		}
	]);

	login.directive('signIn', function () {
		return {
			restrict: 'A',
			controller: ['$scope', 
				function ($scope) {
					this.user = {
						username: '',
						password: ''
					}
				}
			]
		};
	});

	login.controller('SignInCtrl', ['$scope', '$location',
		function ($scope, $location) {
			this.user = {
				username: '',
				password: ''
			}

			this.submit = function (loginForm) {
				if ( loginForm.username.$modelValue === 'test' && loginForm.password.$modelValue === 'test' ) {
					$location.path("/game/");
				}
			}
		}
	]);

	login.controller('RegisterCtrl', ['$scope',
		function ($scope) {
			this.user = {
				username: '',
				password: '',
				confirmPassword: ''
			}
		}
	]);
})();