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

	game.constant('defaulSettings', {
		startInterval: 450,
		intervalStepSpeed: 50,
		gameSpeedStep: 10
	});

	game.service('swipeControl', [
		function () {
			var mc = null,
				events = null;

			// 0 - up
			// 1 - right
			// 2 - down
			// 3 - left 
			this.direction = 0;

			this.onSwipe = function (element, callbacks) {
				if ( callbacks instanceof Array) {
					var start = null;

					mc = mc || new Hammer(element[0]);
					events = events || {
						start: function (ev) {
							start = {
								x: ev.pointers[0].clientX,
								y: ev.pointers[0].clientY
							};
						},
						move: function (ev) {
							var current = {
									x: ev.pointers[0].clientX,
									y: ev.pointers[0].clientY
								},
								tmp = {
									x: current.x - start.x,
									y: current.y - start.y
								};

							if ( Math.sqrt( Math.pow(tmp.x, 2) + Math.pow(tmp.y, 2) ) > 50 ) {
								if ( (tmp.x > 0 && tmp.y < 0 && tmp.x >= -tmp.y) || (tmp.x > 0 && tmp.y >= 0 && tmp.x > tmp.y) ) {
									//right swipe
									console.log('right')
									element.
								}
								else if ( (tmp.x >= 0 && tmp.y < 0 && -tmp.y > tmp.x) || (tmp.x < 0 && tmp.y < 0 && tmp.x >= tmp.y) ) {
									//top swipe
									console.log('top')
								}
								else if ( (tmp.x < 0 && tmp.y <= 0 && tmp.x < tmp.y) || (tmp.x < 0 && tmp.y > 0 && -tmp.x >= tmp.y) ) {
									//left swipe
									console.log('left')
								}
								else {
									console.log('bottom')
								}

								start = current;
							}
						},
						end: function (ev) {
						}
					};

					mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

					mc.on('panstart', events.start);
					mc.on('panmove', events.move);
					mc.on('panend', events.end);
				}
			}

			this.offSwipe = function () {
				mc.off('panstart', events.start);
				mc.off('panmove', events.move);
				mc.off('panend', events.end);
			}
		}
	]);

	game.factory('snake', ['settings', 'defaulSettings', '$interval', 'swipeControl',
		function (settings, defaulSettings, $interval, swipeControl) {
			var screenWidth = window.innerWidth,
				screenHeight = window.innerHeight,
				lines = Math.floor(screenHeight / 8) - 1,
				columns = Math.floor(screenWidth / 8) - 1,
				field = [],
				gameInterval = null,
				element = null;

			for ( var i = 0; i <= lines; i++ ) {
				field[i] = [];
				for ( var j = 0; j <= columns; j++ ) {
					field[i][j] = {
						isActive: false
					};
				}
			}

			function clearField () {
				for ( var i = 0; i <= lines; i++ ) {
					for ( var j = 0; j <= columns; j++ ) {
						field[i][j].isActive = false;
						field[i][j].class = '';
					}
				}
			}

			return {
				lines: lines,
				colmns: columns,
				field: field,
				setActive: function (line, column, className) {
					field[line][column].isActive = true;
					field[line][column].class = className;
				},
				setStartPosition: function () {
					clearField();

					this.setActive(lines, Math.round( columns / 2 ), 'active');
					this.setActive(lines - 1, Math.round( columns / 2 ), 'active');
					this.setActive(lines - 2, Math.round( columns / 2 ), 'head');
				},
				setFieldElement: function (el) {
					element = el;
					element.bind('swipe', function(e) {
						console.log(e.direction)
					});
				},
				startGame: function () {
					swipeControl.onSwipe(element, []);
						
					swipe.direction.$watch(function () {

					});

					gameInterval = $inteval(function () {
						
					}, defaulSettings.startInterval - settings.speed * defaulSettings.intervalStepSpeed);
				}
			};
		}
	]);

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

			this.removeActive = function (line, column) {
				this.field[line][column].isActive = false;
				this.field[line][column].class = '';
			}

			this.startGame = function () {
				this.isStarted = true;
				this.isShowField = true;

				screenData.offSwipe();
				snake.setStartPosition();
				snake.startGame();
			}

			this.pauseGame = function () {
				this.isShowField = false;
				screenData.onSwipe();
			}

			this.resumeGame = function () {

			}

			this.endGame = function () {

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