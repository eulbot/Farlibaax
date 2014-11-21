
angular.module('app')
	.directive('fbxImageRoller', ['$rootScope', 'MapService', function(rootScope, MapService) {
	return {
		scope: true,
		templateUrl: 'templates/fbxImageRoller.html',
		link: function(scope, element, attrs) {

			var scrollPane, currentPos;
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

					scrollPane = $('#entryListing').bind('jsp-scroll-y', handleScroll).jScrollPane({
					    'showArrows': false,
						verticalDragMinHeight: 30,
						autoReinitialise: false,
					    animateDuration : 1000,
					    animateEase : 'swing',
					    animateComplete: callMe
					});

					$('.jspScrollable').mouseenter(function(){
					    $(this).find('.jspDrag').stop(true, true).fadeIn('slow');
					});
					$('.jspScrollable').mouseleave(function(){
					    $(this).find('.jspDrag').stop(true, true).fadeOut('slow');
					});

					$('#fbxImageRoller img').scroll(function() {
						console.log("image clicked");
					});
				}
			});

			scope.$on('jumpTo', function(event, args) {
				if(args.source !== 'imageRoller') {
					scrollPane.unbind('jsp-scroll-y');
					var api = scrollPane.data('jsp');
					api.scrollToElement($('#fbxImageRoller').find('div[pos=' + args.pos + ']')[0], true, true);
				}	
			});

			function handleScroll() {
				$('#fbx_frontpage, #entryListing div.group_container').each(function(index) {
					
					var offset = $(this).offset().top,
					height = $(this).height(),
					pos = parseInt($(this).attr('pos')),
					threshold = $(window).height() - ($(window).height() / 3);

					if(offset < threshold && (offset + height) > threshold) {
						if(pos != MapService.currentPos()) {
          					rootScope.$broadcast('jumpTo', {pos:pos, source:'imageRoller'});
          					return false;
						}
					}
				});

				if($('#fbx_titleDiagram').offset().top * -1 > 180) 
					$('#fbx_menuBar').slideDown();

				if($('#fbx_titleDiagram').offset().top * -1 < 80) 
					$('#fbx_menuBar').slideUp();
				
			}

			function callMe() {
				scrollPane.bind('jsp-scroll-y', handleScroll);
			}
		}
	}
}]);