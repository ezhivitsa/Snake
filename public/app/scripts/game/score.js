(function () {
	'use strict';

	var score = angular.module('scoreControl', []);

	score.constant('defaultSettings', {
		startScore: 500,
		minusScore: 1,
		plusScore: 100
	});

	score.service('score', ['defaultSettings',
		function (defaultSettings) {
			var currentScore = 0;

			this.setStartScore = function () {
				currentScore = defaultSettings.startScore;
			}

			this.minusScore = function () {
				currentScore -= defaultSettings.minusScore;
			}

			this.plusScore = function () {
				currentScore += defaultSettings.plusScore;
			}

			this.getScore = function () {
				return currentScore;
			}

			this.publishScore = function () {
				// ToDo create server and send result to the server
			}
		}
	]);

})();