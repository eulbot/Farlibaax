angular.module('app').directive('fbxIconClock', ['$rootScope', function(fbxService) {
  return {
    template: '<svg viewBox="0 0 120 120"><g><path d="M58.954,55.79l23.669,25.362l-4.521,4.64L49.484,60.33l-0.526-4.003l2.044-38.263h5.945L58.954,55.79z M112,56 c0,30.926-25.074,56-56,56S0,86.926,0,56S25.074,0,56,0S112,25.074,112,56z M102.666,56c0-25.774-20.893-46.667-46.666-46.667 S9.333,30.226,9.333,56c0,25.773,20.894,46.666,46.667,46.666S102.666,81.773,102.666,56z"/></g></svg>',
    replace: false,
    controller: function($scope, $element, $attrs) {
      var x = 1;
    }
  };
}]);

angular.module('app').directive('fbxIconMountain', ['$rootScope', function(fbxService) {
  return {
    template: '<svg viewBox="0 1 24 24"><g><path d="M14,6l-3.8,5l2.9,3.8L11.5,16C9.8,13.8,7,10,7,10l-6,8h22L14,6z"></path></g></svg>',
    replace: false,
    controller: function($scope, $element, $attrs) {
      var x = 1;
    }
  };
}]);