(function () {
	'use strict';

	angular.module('app').controller('fbxMainController', ['$scope', '$rootScope', 'fbxService', 'config', function(scope, rootScope, fbxService, config) {
  		
		var trackpath = '/kml/Haidsteig.kml',
		imagePath = '/kml/images.xml';


		function init() {

			scope.trackTitle = 'Haidsteig';
			scope.trackLocation = 'Prain an der Rax';

			fbxService.loadTrack(trackpath, function() { 
				fbxService.loadImages(imagePath, getTripInfo)
			});
		}

		function getTripInfo() {
			scope.$apply(function() {
				scope.images = fbxService.images();
				scope.imageGroups = [];
				scope.tripDate = fbxService.tripDate();
				scope.ascent = fbxService.ascent();
				scope.descent = fbxService.descent();
				scope.imageLength = scope.images.length;
				scope.loadedImages = 0;
			});
		}

		init();
	}]);
})();