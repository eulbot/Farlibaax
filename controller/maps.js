angular.module('app').controller('MapController', ['$scope', '$rootScope', 'MapService', function(scope, rootScope, MapService) {
  
  var map, marker, offset = 700, colActive = '#f44336', colInactive = '#333';

  var mapOptions = {
      zoom: 16, 
      streetViewControl: false, 
      navigationControl: false,
      scaleControl: true, 
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN
  }

  var markerOptions = {
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colActive,
      fillOpacity: 1,
      strokeColor: colActive,
      scale: 3
    },
    draggable: false
  };

  var lineOptions = {
    geodesic: true,
    strokeColor: colInactive,
    strokeOpacity: 1.0,
    strokeWeight: 2,
    visible: true
  }
  
  scope.$on('crtPosChanged', function(event, args) {

    //Set the color of the current path
    if(args.next) {
      MapService.current().line.setOptions({strokeColor: colActive, strokeWeight: 3});
    }
    else {
      MapService.previous().line.setOptions({strokeColor: colInactive, strokeWeight: 2});
    }

    // Move marker to current postion
    marker.setPosition(MapService.current().location);

    if(MapService.current().pan) {
      panToCurrent();
    }
  });

  scope.$on('mapResized', function(event, args){
    offset = args.offset;

    if(MapService.all().length > 0)
      panToCurrent();
  });

  scope.$on('trackLoaded', function(){
    if (document.readyState == 'complete')
      init();
  });

  google.maps.event.addDomListener(window, 'load', function() {
    if(MapService.all().length > 0)
      init();

    rootScope.$broadcast('docLoaded');
  });

  function init() {
    map = new google.maps.Map(document.getElementById('fbx_map'), mapOptions);
    map.setCenter(MapService.current().location);

    // Create the marker
    markerOptions.map = map;
    markerOptions.position = MapService.current().location;
    marker = new google.maps.Marker(markerOptions);
  
    for (var i = 0; i < MapService.all().length; i++) {

      if(i > 0) {
        lineOptions.path = [
          MapService.entryAt(i - 1).location,
          MapService.entryAt(i).location
        ];
        MapService.entryAt(i).line = new google.maps.Polyline(lineOptions);
        MapService.entryAt(i).line.setMap(map);
      }
    };

    google.maps.event.addListenerOnce(map, 'idle', function(){
      map.setCenterWithOffset(MapService.current().location, -offset/2, 0, true);
      setTimeout(function(){rootScope.$broadcast('mapLoaded', {map:map});}, 1000);
    });
  };

  // Thanks @iambriansreed 
  google.maps.Map.prototype.setCenterWithOffset = function(latlng, offsetX, offsetY, pan) {
    var map = this;
    var ov = new google.maps.OverlayView();
    ov.onAdd = function() {
        var proj = this.getProjection();
        var aPoint = proj.fromLatLngToContainerPixel(latlng);
        aPoint.x = aPoint.x+offsetX;
        aPoint.y = aPoint.y+offsetY;
        if(pan)
          map.panTo(proj.fromContainerPixelToLatLng(aPoint));
        else
          map.setCenter(proj.fromContainerPixelToLatLng(aPoint));
    }; 
    ov.draw = function() {}; 
    ov.setMap(this); 
  };

  function panToCurrent() {
      map.setCenterWithOffset(MapService.nextPanEntry().location, -offset/2, 0, true);
  }
  
}]);