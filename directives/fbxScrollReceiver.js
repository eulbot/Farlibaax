
angular.module('app').directive('fbxScrollReceiver', ['$rootScope', 'MapService', function(rootScope, MapService) {
  return {
    link: function(scope, element, attrs) {

      $('#fbx_map').bind('mousewheel DOMMouseScroll', function(e){

        var crtPosChanged = false;

        if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) {
          crtPosChanged = MapService.nextEntry();
          
          if(crtPosChanged)
            rootScope.$broadcast('crtPosChanged', {next: true});
        }
        else {
          if(MapService.prevEntry())
            rootScope.$broadcast('crtPosChanged', {next: false});

        }

        rootScope.$broadcast('globalScroll');
      });
    }
  };
}]);