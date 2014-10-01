
angular.module('app').directive('fbxCenterMap', ['$rootScope', 'MapService', function(rootScope, MapService) {
  return {
    link: function(scope, element, attrs) {
     
      var ct;

      function resized(){
        rootScope.$broadcast('mapResized', {offset: $('#entryListing').width()});
      }

      $(window, '#entryListing').resize(function(){
        clearTimeout(ct);
        ct = setTimeout(resized, 300);
      });

      scope.$on('mapLoaded', function() {
      });
    }
  };
}]);