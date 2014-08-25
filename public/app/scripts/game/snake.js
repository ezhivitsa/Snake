(function () {
	'use strict';

	var snake = angular.module('snakeControl', [
		'scoreControl'
	]);

	snake.constant('defaulSettings', {
		startInterval: 450,
		intervalStepSpeed: 50,
		gameSpeedStep: 10,
		startDirection: 0
	});

	snake.constant('classNames', {
		active: 'active',
		head: 'head',
		end: 'end',
		food: 'food'
	});

	snake.factory('snake', ['settings', 'defaulSettings', '$interval', 'score', 'classNames',
		function (settings, defaulSettings, $interval, score, classNames) {
			var screenWidth = window.innerWidth,
				screenHeight = window.innerHeight,
				lines = Math.floor(screenHeight / 8) - 1,
				columns = Math.floor(screenWidth / 8) - 1;

			var field = [],
				gameInterval = null,
				element = null,
				snakeDirection = 0,
				tmpDirection = 0,
				headPosition = null,
				endPosition = null,
				activePositions = [],
				food = null;

			var stopCallback = null;

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
						removeActive(i, j);
					}
				}
			}

			function removeActive (line, column) {
				if ( field[line][column].isActive ) {
					switch ( field[line][column].class ) {
						case classNames.head:
							headPosition = null;
							break;
						case classNames.end:
							endPosition = null;
							break;
						case classNames.active:
							for ( var i = 0; i < activePositions.length; i++ ) {
								if ( activePositions[i][0] === line && activePositions[i][1] === column ) {
									activePositions.splice(i, 1);
									break;
								}
							}
							break;
						case classNames.food:
							food = null;
							break;
					}

					field[line][column].isActive = false;
					field[line][column].class = '';
				}
			}

			function setActive (line, column, className) {
				if ( field[line][column].isActive ) {
					if ( field[line][column].class != className  || field[line][column].class === classNames.active ) {
						removeActive(line, column);
					}
				}

				switch (className) {
					case classNames.head:
						headPosition = [line, column];
						break;
					case classNames.end:
						endPosition = [line, column];
						break;
					case classNames.active:
						activePositions.unshift([line, column]);
						break;
					case classNames.food:
						food = [line, column];
						break;
				}

				field[line][column].isActive = true;
				field[line][column].class = className;
			}

			function addFood() {
				var totalBlocks = field.length * field[0].length - 2 - activePositions.length;

				if ( !totalBlocks ) {
					//WIN and end of the game
					return false;
				}
				
				var number = Math.floor(Math.random() * totalBlocks) + 1;

				for ( var i = 0, k = 1; i <= lines; i++ ) {
					for ( var j = 0; j <= columns; j++) {
						if ( k == number ) {
							setActive(i, j, classNames.food);
							return true;
						}
						else if ( field[i][j].isActive == false ) {
							k++;
						}
					}
				}
			}

			return {
				lines: lines,
				colmns: columns,
				field: field,
				setStopCallback: function (sc) {
					stopCallback = sc;
				},
				setStartPosition: function () {
					snakeDirection = tmpDirection = defaulSettings.startDirection;

					clearField();

					setActive(lines, Math.round( columns / 2 ), classNames.end);
					setActive(lines - 1, Math.round( columns / 2 ), classNames.active);
					setActive(lines - 2, Math.round( columns / 2 ), classNames.head);
					addFood();
					score.setStartScore();
				},
				setFieldElement: function (el) {
					element = el;
					element.bind('swipe', function(e) {
						if ( Math.abs( snakeDirection - e.direction) != 2 ) {
							// change directions of movement of the snake
							tmpDirection = e.direction;
						}
					});
				},
				startGame: function () {
					// swipeControl.onSwipe(element, []);
					var self = this;

					gameInterval = $interval(function () {

						var headLine = headPosition[0],
							headColumn = headPosition[1];

						switch (snakeDirection) {
							case 0:
								headLine--;
								break;
							case 1:
								headColumn++;
								break;
							case 2:
								headLine++;
								break;
							case 3:
								headColumn--;
								break;
						}

						if ( 
							headLine < 0 || 
							headLine > lines || 
							headColumn < 0 || 
							headColumn > columns || 
							( field[headLine][headColumn].isActive && field[headLine][headColumn].class != classNames.food )
						) {
							// end of the game							
							self.stopGame("lose", score.getScore());
							score.publishScore();
						}
						else {
							var lastActive = activePositions[activePositions.length - 1];

							if (field[headLine][headColumn].class === classNames.food) {
								setActive(headPosition[0], headPosition[1], classNames.active);
								setActive(headLine, headColumn, classNames.head);
								score.plusScore();

								if ( !addFood() ) {
									self.stopGame("win", score.getScore());
									score.publishScore();
								} 
							}
							else {
								score.minusScore();
								removeActive(endPosition[0], endPosition[1]);
								setActive(headPosition[0], headPosition[1], classNames.active);
								setActive(headLine, headColumn, classNames.head);
								setActive(lastActive[0], lastActive[1], classNames.end);								
							}
						}

						snakeDirection = tmpDirection;

					}, defaulSettings.startInterval - settings.speed * defaulSettings.intervalStepSpeed);
				},
				stopGame: function (result, score) {
					$interval.cancel(gameInterval);
					( stopCallback ) && stopCallback(result, score);
				}
			};
		}
	]);
})();