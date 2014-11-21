angular.module('app').controller('MapController', ['$scope', '$rootScope', 'MapService', function(scope, rootScope, MapService) {
  
  var map, marker, offset = 700, colActive = '#f44336', colInactive = '#333';

  var mapOptions = {
      zoom: 16, 
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_TOP
      },
      streetViewControl: false,
      scrollwheel: false, 
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.TERRAIN
  }

  var photoIcon = {
    path: 'M50,30c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15C65,36.718,58.283,30,50,30z M90,15H78 c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,1.28,68.65,0,67,0H33c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309 C25.426,13.72,23.65,15,22,15H10C4.5,15,0,19.5,0,25v45c0,5.5,4.5,10,10,10h80c5.5,0,10-4.5,10-10V25C100,19.5,95.5,15,90,15z M50,70c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25c13.805,0,25,11.194,25,25C75,58.807,63.805,70,50,70z M86.5,31.993 c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5c1.934,0,3.5,1.568,3.5,3.5C90,30.427,88.433,31.993,86.5,31.993z',
    fillColor: colInactive,
    fillOpacity: 1,
    strokeColor: colInactive,
    strokeWeight: 1,
    scale: 0.15,
    anchor: new google.maps.Point(-20, -20)
  }

  var markerOptions = {
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colActive,
      fillOpacity: 1,
      strokeColor: colActive,
      scale: 3,
      zIndex: 9999
    },
    draggable: false
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
      MapService.current().line.setOptions({strokeColor: colActive, strokeWeight: 3, zIndex: 10});
    }
    else {
      MapService.previous().line.setOptions({strokeColor: colInactive, strokeWeight: 2, zIndex: 5});
    }

    setMarkerToCurrent();

    if(MapService.current().pan) {
      panToCurrent();
    }
  });

  scope.$on('mapResized', function(){

    if(MapService.all().length > 0)
      panToCurrent();
  });

  scope.$on('trackLoaded', function(){
    if (document.readyState == 'complete')
      init();
  });

  scope.$on('jumpTo', function(event, args) {

    console.log(args.source);
    var forward = MapService.currentPos() < args.pos;

    if(MapService.currentPos() != args.pos) {
      while(MapService.currentPos() != args.pos) {
        if(forward) {
            MapService.nextEntry();
            MapService.current().line.setOptions({strokeColor: colActive, strokeWeight: 3, zIndex: 9999});
        }
        else {
          MapService.prevEntry();
          MapService.previous().line.setOptions({strokeColor: colInactive, strokeWeight: 2, zIndex: 5});
        }
      }

      setMarkerToCurrent();
      panToCurrent();
    }
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

      var entry = MapService.entryAt(i);

      if(i > 0) {
        lineOptions.path = [
          MapService.entryAt(i - 1).location,
          entry.location
        ];
        entry.line = new google.maps.Polyline(lineOptions);
        entry.line.setMap(map);
      }

      // Add photo icon if there are some
      if(entry.images) {

        var photoMarker = new google.maps.Marker({
          position: entry.location,
          pos: i,
          icon: photoIcon,
          map: map,
          zIndex: 1
        });

        google.maps.event.addListener(photoMarker, 'click', function() {
          rootScope.$broadcast('jumpTo', {pos:this.pos, source:'map'});
        });

      }
    };

    google.maps.event.addListenerOnce(map, 'idle', function(){
      map.panTo(MapService.current().location);
      setTimeout(function(){rootScope.$broadcast('mapLoaded', {map:map});}, 1000);
    });
  };

  function setMarkerToCurrent() {

    // Move marker to current postion
    marker.setPosition(MapService.current().location);
  }

  function panToCurrent() {
      map.panTo(MapService.nextPanEntry().location);
  }
  
}]);