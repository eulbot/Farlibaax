angular.module('app').directive('fbxScrollReceiver', ['$rootScope', 'fbxService', function(rootScope, fbxService) {
  return {
    link: function(scope, element, attrs) {

      $('#fbx_map').bind('mousewheel DOMMouseScroll', function(e){

        var crtPosChanged = false;

        if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) {
          crtPosChanged = fbxService.nextEntry();
          
          if(crtPosChanged)
            rootScope.$broadcast('crtPosChanged', {next: true});
        }
        else {
          if(fbxService.prevEntry())
            rootScope.$broadcast('crtPosChanged', {next: false});
        }

        if(fbxService.current().images) {
          rootScope.$broadcast('jumpTo', {pos:fbxService.currentPos(), source:'scrollReceiver'});
        }

        rootScope.$broadcast('globalScroll');
      });
    }
  };
}]);