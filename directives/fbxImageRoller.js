
angular.module('app')
	.directive('fbxImageRoller', ['$rootScope', 'fbxService', function(rootScope, fbxService) {
		return {
			templateUrl: 'templates/fbxImageRoller.html',
			controller: function($scope) {
				var ct, scope = $scope, scrollPane;

				scope.$watch(function() {return scope.images}, function(){
					if (scope.images) {
		
						for(var i = 0; i < scope.images.length; i++) {
							if($.inArray(scope.images[i].pos, scope.imageGroups) === -1)
								scope.imageGroups.push(scope.images[i].pos);
						}

						scope.imageGroup = function(pos) {
							return $.grep(scope.images, function(e){ return e.pos == pos; });
						}

						scrollPane = $('#entryListing').bind('jsp-scroll-y', handleScroll).jScrollPane({
						    'showArrows': false,
							verticalDragMinHeight: 30,
							autoReinitialise: false,
						    animateDuration : 1000,
						    animateEase : 'swing',
						    animateComplete: registerHandler
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
							if(pos != fbxService.currentPos()) {
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

				function registerHandler() {
					scrollPane.bind('jsp-scroll-y', handleScroll);
				}
				
				this.refreshScroll = function() {
					scope.$apply(function() {
						scope.loadedImages = scope.loadedImages + 1;
					});
			        clearTimeout(ct);
			        ct = setTimeout(function() {
			        	scrollPane.data('jsp').reinitialise();
			        }, 100);
		    	};
			}
		}
	}])
	.directive('fbxRefreshScroll', function () {       
    	return {
			require: '^fbxImageRoller',
	        link: function(scope, element, attrs, roller) {   

	            element.bind('load' , function(e){ 
	            	roller.refreshScroll();
	            });
	        }
    	}
    }
);

