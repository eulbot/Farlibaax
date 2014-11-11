
angular.module('app').directive('fbxMenuVisability', ['$rootScope', function(rootScope) {
  return {
    link: function(scope, element, attrs) {
     
      var visible = false;

      scope.$on('globalScroll', function(){
        if(($('#scaffold').scrollTop() >= $(this).height() / 2) && !visible)
          $('#fbx_menuBar').slideDowm(250);


        if(($('#scaffold').scrollTop() < $(this).height() / 2) && visible)
          $('#fbx_menuBar').slideUp(250);
      });
    }
  };
}]);