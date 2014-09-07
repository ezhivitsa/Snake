(function () {
	'use scrict';

	var game = angular.module('snakeGame', [
		'snakeControl'
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
						width: '118px'
					}
				},
				{
					name: "settings",
					url: "settings",
					style: {
						width: '165px'
					}
				},
				{
					name: "play game",
					url: "playgame",
					style: {
						width: '208px'
					}
				},
				{
					name: "score",
					url: "score",
					style: {
						width: '118px'
					}
				},
				{
					name: "settings",
					url: "settings",
					style: {
						width: '165px'
					}
				},
				{
					name: "play game",
					url: "playgame",
					style: {
						width: '208px'
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
				this.score = 0;

				screenData.isDraggble = false;

				var self = this;
				snake.setStopCallback(function (result, score) {
					self[result] = true;

					self.isStarted = false;
					self.isShowField = false;
					self.score = score;
					screenData.isDraggble = true;
				});
				snake.setStartPosition();
				snake.startGame();
			}

			this.pauseGame = function () {
				this.isShowField = false;
				screenData.isDraggble = true;
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

	game.factory('scoreF', function () {
		return {
			scoreResults: [
				{
					user: 'test',
					score: 1032
				},
				{
					user: 'test',
					score: 596
				},
				{
					user: 'test',
					score: 337
				}
			],
			addScore: function (res) {
				this.scoreResults.push({
					user: res.user,
					score: res.score
				});
			}
		}
	});

	game.controller('ScoreCtrl', ['$scope', 'scoreF',
		function ($scope, scoreF) {
			this.scoreResults = scoreF.scoreResults;
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

					scope.swipeEvent = function (e) {
						switch ( e.gesture.direction ) {
							case "up":
								element.triggerHandler({ type: 'swipeC', direction: 0 });
								break;
							case "right":
								element.triggerHandler({ type: 'swipeC', direction: 1 });
								break;
							case "down":
								element.triggerHandler({ type: 'swipeC', direction: 2 });
								break;
							case "left":
								element.triggerHandler({ type: 'swipeC', direction: 3 });
								break;
						}
					}
				}
			};
		}
	]);
})();