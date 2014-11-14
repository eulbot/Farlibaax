
angular.module('app').directive('fbxCenterMap', ['$rootScope', 'MapService', function(rootScope, MapService) {
  return {
    link: function(scope, element, attrs) {
     
      var ct;

      function resized(){
        rootScope.$broadcast('mapResized', {offset: $('#entryListing').width()});
        $('#fbx_frontpage').height($(window).height());

          var pane = $('#entryListing').data('jsp');
          pane.reinitialise();
      }

      $(window, '#entryListing').resize(function(){
        clearTimeout(ct);
        ct = setTimeout(resized, 300);
      });

      $(document).ready(function(){
        $('#fbx_frontpage').height($(window).height());
      })
    }
  };
}]);