angular.module('app').controller('MapController', ['$scope', '$rootScope', 'MapService', 'config', function(scope, rootScope, MapService, config) {
  
  var map, marker, offset = 700, colActive = '#f44336', colInactive = '#333';
  
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
    map = new google.maps.Map(document.getElementById('fbx_map'), config.mapOptions);
    map.setCenter(MapService.current().location);

    // Create the marker
    config.markerOptions.map = map;
    config.markerOptions.position = MapService.current().location;
    marker = new google.maps.Marker(config.markerOptions);
  
    for (var i = 0; i < MapService.all().length; i++) {

      var entry = MapService.entryAt(i);

      if(i > 0) {
        config.lineOptions.path = [
          MapService.entryAt(i - 1).location,
          entry.location
        ];
        entry.line = new google.maps.Polyline(config.lineOptions);
        entry.line.setMap(map);
      }

      // Add photo icon if there are some
      if(entry.images) {

        var photoMarker = new google.maps.Marker({
          position: entry.location,
          pos: i,
          icon: config.photoIcon,
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