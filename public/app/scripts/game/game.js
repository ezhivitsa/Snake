(function () {
	'use scrict';

	var game = angular.module('snakeGame', []);

	game.factory('settings', function () {
		var settings = {
			difficulty: 1,
			difficultyOptions: [
				{
					name: 'hard',
					number: 0
				},
				{
					name:'medium',
					number: 1
				},
				{
					name: 'easy',
					number: 2
				}
			],

			speed: 1,
			speedOptions: [
				{
					name: 1,
					number: 0						
				},
				{
					name: 2,
					number: 1
				},
				{
					name: 3,
					number: 2
				},
				{
					name: 4,
					number: 3
				},
				{
					name: 5,
					number: 4
				}
			],

			control: 0,
			controlOptions: [
				{
					name: 'touch control',
					number: 0
				},
				{
					name: 'accelerometer',
					number: 1
				}
			]
		};

		if ( !window.DeviceMotionEvent ) {
			settings.controlOptions.pop();
		}

		return settings;
	});

	game.controller('GameScreenCtrl', ['$scope', 
		function ($scope) {
			this.menu = [
				{
					name: "score",
					url: "score",
					style: {
						width: '108px'
					}
				},
				{
					name: "settings",
					url: "settings",
					style: {
						width: '155px'
					}
				},
				{
					name: "play game",
					url: "playgame",
					style: {
						width: '198px'
					}
				},
				{
					name: "score",
					url: "score",
					style: {
						width: '108px'
					}
				},
				{
					name: "settings",
					url: "settings",
					style: {
						width: '155px'
					}
				},
				{
					name: "play game",
					url: "playgame",
					style: {
						width: '198px'
					}
				}
			];

			this.navStyle = {};
		}
	]);

	game.controller('SettingsCtrl', ['$scope', 'settings',
		function ($scope, settings) {
			this.difficulty = settings.difficulty;
			this.difficultyOptions = settings.difficultyOptions;

			this.speed =  settings.speed;
			this.speedOptions = settings.speedOptions;

			this.control =  settings.control;
			this.controlOptions = settings.controlOptions;
		}
	]);

	game.controller('GameCtrl', ['$scope', 'screenData',
		function ($scope, screenData) {
			this.isStarted = false;
			this.isShowField = false;
			this.field = [];

			this.startGame = function() {
				this.isStarted = true;
				this.isShowField = true;
			}

			this.setActive = function (line, column, className) {
				this.field[line][column].isActive = true;
				this.field[line][column].class = className;
			}

			this.removeActive = function (line, column) {
				this.field[line][column].isActive = false;
				this.field[line][column].class = '';
			}

			this.startGame = function () {
				this.isStarted = true;
				this.isShowField = true;

				this.setActive(lines, Math.round( columns / 2 ), 'active');
				this.setActive(lines - 1, Math.round( columns / 2 ), 'active');
				this.setActive(lines - 2, Math.round( columns / 2 ), 'head');

				//debugger
				console.log(angular.element(document.querySelector('.screen-wrapper')))
				screenData.offSwipe(angular.element(document.querySelector('.screen-wrapper')));
			}

		}
	]);

	game.controller('ScoreCtrl', ['$scope', 
		function ($scope) {

		}
	]);

	game.directive('field', ['screenData', 
		function (screenData) {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					model: '='
				},
				link: function (scope, element, attrs) {
					scope.$apply(function () {
						var screenWidth = window.innerWidth,
							screenHeight = window.innerHeight,
							lines = Math.floor(screenHeight / 8) - 1,
							columns = Math.floor(screenWidth / 8) - 1;

						for ( var i = 0; i <= lines; i++ ) {
							this.field[i] = [];
							for ( var j = 0; j <= columns; j++ ) {
								this.field[i][j] = {
									isActive: false
								};
							}
						}
					});
				}
			};
		}
	]);
})();