
angular.module('app')
	.directive('fbxImageRoller', ['$rootScope', 'MapService', function(rootScope, MapService) {
	return {
		scope: true,
		templateUrl: 'templates/fbxImageRoller.html',
		link: function(scope, element, attrs) {

			scope.images = [];

			scope.$on('trackLoaded', function(){
				if (document.readyState == 'complete') {

					scope.$apply(function() {
						scope.images = MapService.images();
					});

					$('#entryWrapper').slimScroll({
				        height: '100%'
				   });

				   $("img.lazy").lazyload({
    					effect : "fadeIn"
					});
				}
			});
		}
	}
}]);