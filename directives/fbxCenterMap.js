
angular.module('app').directive('fbxCenterMap', ['$rootScope', 'fbxService', function(rootScope, fbxService) {
  return {
    link: function(scope, element, attrs) {

      var ct;

      $(window).resize(function(){
        clearTimeout(ct);
        ct = setTimeout(resetDimensions, 300);
      });

      $(document).ready(function(){
        resetDimensions();
      })

      function resetDimensions() {
        var pane = $('#entryListing').data('jsp');

        // Redraw the scroll bar
        if(!!pane)
          pane.reinitialise();

        // Set the paddding of the map to the width of the entry listing
        $('#fbx_mapContainer').css('padding-left', $('#entryListing').width());

        // Set the height of the title page to the window height
        $('#fbx_frontpage').height($(window).height());

        // Broadcast event
        rootScope.$broadcast('mapResized');
      }
    }
  };
}]);