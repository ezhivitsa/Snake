(function () {
	'use strict';

	var swipe = angular.module('swipeControl', []);

	swipe.service('swipeControl', [
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

							if ( Math.sqrt( Math.pow(tmp.x, 2) + Math.pow(tmp.y, 2) ) > 100 ) {
								if ( (tmp.x > 0 && tmp.y < 0 && tmp.x >= -tmp.y) || (tmp.x > 0 && tmp.y >= 0 && tmp.x > tmp.y) ) {
									//right swipe
									element.triggerHandler({ type: 'swipe', direction: 1 });
								}
								else if ( (tmp.x >= 0 && tmp.y < 0 && -tmp.y > tmp.x) || (tmp.x < 0 && tmp.y < 0 && tmp.x >= tmp.y) ) {
									//top swipe
									element.triggerHandler({ type: 'swipe', direction: 0 });
								}
								else if ( (tmp.x < 0 && tmp.y <= 0 && tmp.x < tmp.y) || (tmp.x < 0 && tmp.y > 0 && -tmp.x >= tmp.y) ) {
									//left swipe
									element.triggerHandler({ type: 'swipe', direction: 3 });
								}
								else {
									//bottom swipe
									element.triggerHandler({ type: 'swipe', direction: 2 });
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
})();