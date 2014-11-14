
angular.module('app')
	.directive('fbxImageRoller', ['$rootScope', 'MapService', function(rootScope, MapService) {
	return {
		scope: true,
		templateUrl: 'templates/fbxImageRoller.html',
		link: function(scope, element, attrs) {

			var scrollPane;
			scope.images = [], scope.imageGroups = [];

			scope.$on('trackLoaded', function(){
				if (document.readyState == 'complete') {

					scope.$apply(function() {
						scope.images = MapService.images();
						
						for(var i = 0; i < scope.images.length; i++) {
							if($.inArray(scope.images[i].pos, scope.imageGroups) === -1)
								scope.imageGroups.push(scope.images[i].pos);
						}
					});

					scope.imageGroup = function(pos) {
						return $.grep(scope.images, function(e){ return e.pos == pos; });
					}

					scrollPane = $('#entryListing').jScrollPane({
					    'showArrows': false,
						verticalDragMinHeight: 30,
						autoReinitialise: false
					});

					$('.jspScrollable').mouseenter(function(){
					    $(this).find('.jspDrag').stop(true, true).fadeIn('slow');
					});
					$('.jspScrollable').mouseleave(function(){
					    $(this).find('.jspDrag').stop(true, true).fadeOut('slow');
					});
				}
			});

			scope.$on('jumpTo', function(event, args) {
				var api = scrollPane.data('jsp');
				api.scrollToElement($('#fbxImageRoller').find('div[pos=' + args.pos + ']')[0], true, true);
			});
		}
	}
}]);