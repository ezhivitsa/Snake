(function () {
	'use scrict';

	var game = angular.module('snakeGame', [
		'snakeControl',
		'swipeControl'
	]);

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

	game.controller('GameCtrl', ['$scope', 'screenData', 'snake',
		function ($scope, screenData, snake) {
			this.isStarted = false;
			this.isShowField = false;
			this.win = false;
			this.lose = false;

			this.removeActive = function (line, column) {
				this.field[line][column].isActive = false;
				this.field[line][column].class = '';
			}

			this.startGame = function () {
				this.isStarted = true;
				this.isShowField = true;
				this.win = false;
				this.lose = false;

				screenData.offSwipe();
				var self = this;
				snake.setStopCallback(function (result) {
					self[result] = true;

					self.isStarted = false;
					self.isShowField = false;
					screenData.onSwipe();
				});
				snake.setStartPosition();
				snake.startGame();
			}

			this.pauseGame = function () {
				this.isShowField = false;
				screenData.onSwipe();
				snake.stopGame();
			}

			this.resumeGame = function () {
				this.isShowField = true;
				snake.startGame();
			}

			this.endGame = function () {
				this.isStarted = false;
			}
		}
	]);

	game.controller('ScoreCtrl', ['$scope', 
		function ($scope) {

		}
	]);

	game.directive('field', ['screenData', 'snake',
		function (screenData, snake) {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'templates/field.html',
				//scope: {},
				link: function (scope, element, attrs) {
					scope.field = snake.field;
					snake.setFieldElement(element);

					scope.swipe = {
						up: function () {
							console.log('up');
						},
						right: function () {
							console.log('right');
						},
						down: function () {
							console.log('down');
						},
						left: function () {
							console.log('left');
						}

					};

				}//,
				//controller: ['$scope', function ($scope) {
				//}]
			};
		}
	]);
})();