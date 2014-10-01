var app = angular.module('app');

app.factory('MapService', ['$rootScope', function(rootScope) {

  var SAMPLE_TRASHOLD = 300, PAN_STEP = 10;
	var	crtPos = 0, prevPos = -1, trip = [];

  var parseKmlFile = function () {

    // Load the elevation service
    var elevator = new google.maps.ElevationService();
    var pathRequest, path = [];

    $.get('/kml/Haidsteig.xml', function(xml) {

      $(xml).find("Track").find("coord").each(function(i) {

          path.push(new google.maps.LatLng($(this).html().split(' ')[1], $(this).html().split(' ')[0]));
        /*coord = $(this).html().split(' ');

        if(i % 30 == 0) {
          coord = $(this).html().split(' ');
          if(i % 60 == 0)
            trip.push({lat:coord[1], lng:coord[0], alt:coord[2], pan:true});
          else
            trip.push({lat:coord[1], lng:coord[0], alt:coord[2], pan:false});
        }*/
      });

      if(path.length > SAMPLE_TRASHOLD) {

        var temp_path =[], mod = Math.ceil(path.length / SAMPLE_TRASHOLD)
        
        for(i = 0; i < path.length / mod; i++) {
            temp_path.push(path[mod * i]);
        }

        path = temp_path.slice();
      }

      pathRequest = {
        'path': path,
        'samples': 150
      }

      elevator.getElevationAlongPath(pathRequest, function(results, status) {
        if (status != google.maps.ElevationStatus.OK) {
          return;
        }

        for (var i = 0; i < results.length; i++) {
          var pan = i % PAN_STEP == 0 ? true : false;
          trip.push({location:results[i].location, elevation:results[i].elevation, pan:pan});
        }
      
        rootScope.$broadcast('trackLoaded');
      });
    });
  };
  
  parseKmlFile();

  return {
    all: function() {
      return trip;
    },
    entryAt: function(i) {
      return trip[i];
    },
    current: function() {
      return trip[crtPos];
    },
    previous: function() {
      if(prevPos >= 0)
        return trip[prevPos];
    },
    atStart: function() {
      return crtPos == 0;
    },
    nextEntry: function() {
      if(crtPos < trip.length - 1) {
        prevPos = crtPos;
        crtPos++;
        return true;
      }
      return false;
    },
    prevEntry: function() {
      if(crtPos > 0){
        prevPos = crtPos;
        crtPos--;
        return true;
      }
      return false;
    }
  };

}]);