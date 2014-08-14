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
						width: '219px'
					}
				},
				{
					name: "sign in",
					url: "signin",
					style: {
						width: '133px'
					}
				},
				{
					name: "registration",
					url: "registration",
					style: {
						width: '219px'
					}
				},
				{
					name: "sign in",
					url: "signin",
					style: {
						width: '133px'
					}
				}
			];

			this.navStyle = {
				overflow: 'visible'
			};
		}
	]);

	login.controller('SignInCtrl', ['$scope', 
		function ($scope) {
			this.user = {
				username: '',
				password: ''
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