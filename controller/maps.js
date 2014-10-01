angular.module('app').controller('MapController', ['$scope', '$rootScope', 'MapService', function(scope, rootScope, MapService) {
  
  var map, offset = 700, colActive = '#f44336', colInactive = '#555'

  var mapOptions = {
      zoom: 15, 
      streetViewControl: false, 
      navigationControl: false,
      scaleControl: true, 
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN
  }
   
  var pointOptions = {
    strokeColor: colActive,
    strokeWeight: 2,
    strokeOpacity: 0.9,
    fillColor: '#eee',
    fillOpacity: 1,
    map: map,
    radius: 12,
    zIndex: 99
  }

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

    // Set point visibility
    MapService.current().point.setVisible(true);
    MapService.previous().point.setVisible(false);

    if(MapService.current().pan) {
      panToCurrent();
    }
  });

  scope.$on('mapResized', function(event, args){
    offset = args.offset;
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
  
    for (var i = 0; i < MapService.all().length; i++) {
       
      pointOptions.center = new MapService.entryAt(i).location;
      pointOptions.map = map;
      pointOptions.visible = i == 0 ? true : false;
      MapService.entryAt(i).point = new google.maps.Circle(pointOptions);

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
      map.setCenterWithOffset(MapService.current().location, -offset/2, 0, true);
  }
  
}]);