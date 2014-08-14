(function () {
	'use scrict';

	var game = angular.module('snakeGame', []);

	game.controller('GameScreenCtrl', ['$scope', 
		function ($scope) {

		}
	]);

	game.controller('SettingsCtrl', ['$scope', 
		function ($scope) {
			this.userSettings = {
				difficulty: 'medium',
				difficultyOptions: [
					 'hard',
					 'medium',
					 'easy'
				],
				speed: 1,
				speedOptions: [ 1, 2, 3, 4, 5 ]
			};
		}
	]);

	game.controller('GameCtrl', ['$scope', 
		function ($scope) {

		}
	]);

	game.controller('ScoreCtrl', ['$scope', 
		function ($scope) {

		}
	]);
})();