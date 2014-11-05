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
      scrollwheel: false 
      //disableDefaultUI: true,
      //mapTypeId: google.maps.MapTypeId.TERRAIN
  }

  var photoIcon = {
    //path: 'M9.958,5.956c-2.577,0-4.667,2.089-4.667,4.667c0,2.577,2.089,4.667,4.667,4.667s4.667-2.09,4.667-4.667 C14.625,8.045,12.535,5.956,9.958,5.956z M9.958,14.123c-1.933,0-3.5-1.568-3.5-3.5c0-1.933,1.567-3.5,3.5-3.5s3.5,1.567,3.5,3.5 C13.458,12.555,11.891,14.123,9.958,14.123z M18.124,3.623h-2.916l-0.583-1.167c0,0-0.522-1.167-1.167-1.167h-7 c-0.645,0-1.167,1.167-1.167,1.167L4.708,3.623H1.792c-0.645,0-1.167,0.522-1.167,1.167v12.832c0,0.645,0.522,1.168,1.167,1.168 h16.333c0.645,0,1.167-0.523,1.167-1.168V4.789C19.291,4.145,18.769,3.623,18.124,3.623z M18.124,17.039 c0,0.322-0.261,0.582-0.583,0.582H2.375c-0.323,0-0.583-0.26-0.583-0.582V5.373c0-0.323,0.261-0.583,0.583-0.583h2.954 C5.316,4.74,5.292,4.695,5.292,4.643l0.933-1.458c0,0,0.418-0.729,0.934-0.729h5.6c0.516,0,0.934,0.729,0.934,0.729l0.934,1.458 c0,0.052-0.024,0.097-0.038,0.146h2.954c0.322,0,0.583,0.261,0.583,0.583V17.039z',
    path: 'M50,30c-8.285,0-15,6.718-15,15c0,8.285,6.715,15,15,15c8.283,0,15-6.715,15-15C65,36.718,58.283,30,50,30z M90,15H78 c-1.65,0-3.428-1.28-3.949-2.846l-3.102-9.309C70.426,1.28,68.65,0,67,0H33c-1.65,0-3.428,1.28-3.949,2.846l-3.102,9.309 C25.426,13.72,23.65,15,22,15H10C4.5,15,0,19.5,0,25v45c0,5.5,4.5,10,10,10h80c5.5,0,10-4.5,10-10V25C100,19.5,95.5,15,90,15z M50,70c-13.807,0-25-11.193-25-25c0-13.806,11.193-25,25-25c13.805,0,25,11.194,25,25C75,58.807,63.805,70,50,70z M86.5,31.993 c-1.932,0-3.5-1.566-3.5-3.5c0-1.932,1.568-3.5,3.5-3.5c1.934,0,3.5,1.568,3.5,3.5C90,30.427,88.433,31.993,86.5,31.993z',
    fillColor: colInactive,
    fillOpacity: 1,
    strokeColor: colInactive,
    strokeWeight: 0.8,
    scale: 0.2
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
          map: map
        });

        google.maps.event.addListener(photoMarker, 'click', function(e, a) {
          var x = "asfd";
        });

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