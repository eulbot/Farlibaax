angular.module('app').controller('fbxMapController', ['$scope', '$rootScope', 'fbxService', 'config', function(scope, rootScope, fbxService, config) {
  
  var map, marker, offset = 700, colActive = '#f44336', colInactive = '#333', ds;
  
  scope.$on('crtPosChanged', function(event, args) {

    //Set the color of the current path
    if(args.next) {
      fbxService.current().line.setOptions({strokeColor: colActive, strokeWeight: 3, zIndex: 10});
    }
    else {
      fbxService.previous().line.setOptions({strokeColor: colInactive, strokeWeight: 2, zIndex: 5});
    }

    setMarkerToCurrent();

    if(fbxService.current().pan) {
      panToCurrent();
    }
  });

  scope.$on('mapResized', function(){

    if(fbxService.all().length > 0)
      panToCurrent();
  });

  scope.$on('trackLoaded', function(){
    if (document.readyState == 'complete')
      init();
  });

  scope.$on('jumpTo', function(event, args) {

    var forward = fbxService.currentPos() < args.pos;

    if(fbxService.currentPos() != args.pos) {
      while(fbxService.currentPos() != args.pos) {
        if(forward) {
            fbxService.nextEntry();
            fbxService.current().line.setOptions({strokeColor: colActive, strokeWeight: 3, zIndex: 9999});
        }
        else {
          fbxService.prevEntry();
          fbxService.previous().line.setOptions({strokeColor: colInactive, strokeWeight: 2, zIndex: 5});
        }
      }

      setMarkerToCurrent();
      panToCurrent();
    }
  });

  scope.$on('diagramShowStateChange', function(event, args) {
    ds = args.state;
    panToCurrent();
  });

  scope.$watch(function(){return scope.mapLocked}, function() {
    if(map) {

      if(scope.mapLocked) {
        map.setOptions(config.mapOptionsLocked);
        panToCurrent();
      }
      else
        map.setOptions(config.mapOptionsUnlocked);
    }
  });

  google.maps.event.addDomListener(window, 'load', function() {
    if(fbxService.all().length > 0)
      init();

    rootScope.$broadcast('docLoaded');
  });

  function init() {
    map = new google.maps.Map(document.getElementById('fbx_map'), config.mapOptions);
    map.setOptions(config.mapOptionsLocked);
    map.setCenter(fbxService.current().location);

    // Create the marker
    config.markerOptions.map = map;
    config.markerOptions.position = fbxService.current().location;
    marker = new google.maps.Marker(config.markerOptions);
  
    for (var i = 0; i < fbxService.all().length; i++) {

      var entry = fbxService.entryAt(i);

      if(i > 0) {
        config.lineOptions.path = [
          fbxService.entryAt(i - 1).location,
          entry.location
        ];
        entry.line = new google.maps.Polyline(config.lineOptions);
        entry.line.setMap(map);
      }

      // Add photo icon if there are some
      if(entry.hasImages) {

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
      map.panTo(fbxService.current().location);
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

  function setMarkerToCurrent() {

    // Move marker to current postion
    marker.setPosition(fbxService.current().location);
  }

  function panToCurrent() {
      if(map && scope.mapLocked) {
        if(ds)
          map.setCenterWithOffset(fbxService.nextPanEntry().location, -100, 0, true);
        else
          map.panTo(fbxService.nextPanEntry().location);

        map.setZoom(16);
      }
  }
  
}]);