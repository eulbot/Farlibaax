(function () {
	'use strict';

	angular.module('app').controller('fbxMainController', ['$scope', '$rootScope', 'MapService', 'config', function(scope, rootScope, service, config) {
  		
		scope.track = [],
		scope.images = [];

		function init() {
			service.loadTrack(function(track){
				scope.track = track;
				service.loadImages(function(images) {
					scope.images = images;
					proceed();
				})
			});

			function proceed() {
				var x = "fuck off";
			}
		}

		init();
	}]);
})();