var app = angular.module('app');

app.factory('fbxService', ['$rootScope', function(rootScope) {

	var SAMPLE_TRASHOLD = 300, 
		PAN_STEP = 10, 
		crtPos = 0, 
		prevPos = -1, 
		trip = [],
		images = [], 
		startDate, 
		endDate, 
		ascent = 0, 
		descent = 0;
	
	var loadTrack = function (trackpath, callback) {

		// Load the elevation service
		var elevator = new google.maps.ElevationService();
		var pathRequest, path = [];

		$.get(trackpath, function(xml) {

			$(xml).find("gx\\:Track, Track").find("gx\\:coord, coord").each(function(i) {

				path.push(new google.maps.LatLng($(this).html().split(' ')[1], $(this).html().split(' ')[0]));
			});

			startDate = Date.parse($(xml).find("gx\\:Track, Track").find("gx\\:coord, coord").first().prev().html());
			endDate = Date.parse($(xml).find("gx\\:Track, Track").find("gx\\:coord, coord").last().prev().html());

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

					if(i > 0) {
						var dif = parseFloat(results[i].elevation - results[i - 1].elevation)
						if(dif >= 0)
							ascent = ascent + dif;
						else
							descent = descent + (dif * -1)
					}
				}

				if(callback)
					callback(trip);
			});
		}, 'xml');
	};

	var loadImages = function(imagepath, callback) {

	 	$.get(imagepath, function(xml) {
	 		$(xml).find("images image").each(function(i) {

	 			if(!trip[$(this).attr('pos')].images)
	 				trip[$(this).attr('pos')].images = [];

	 			trip[$(this).attr('pos')].images.push({src:$(this).html(),alt:$(this).attr('alt')});
	            images.push({pos: $(this).attr('pos'), src:$(this).html(),alt:$(this).attr('alt')});
	 		});

	 		if(callback)
	 			callback(images);
	 		
	 		rootScope.$broadcast('trackLoaded');
	 	}, 'xml');
	 };

	return {
		loadTrack: loadTrack,
		loadImages: loadImages,
	 	all: function() {
	 		return trip;
	 	},
	 	entryAt: function(i) {
	 		return trip[i];
	 	},
	 	current: function() {
	 		return trip[crtPos];
	 	},
	 	currentPos: function() {
	 		return crtPos;
	 	},
	    setCurrentPos: function(pos) {
	        crtPos = pos;
	    },
	 	previous: function() {
	 		if(prevPos >= 0)
	 			return trip[prevPos];
	 	},
	 	previousPos: function() {
	 		if(prevPos >= 0)
	 			return prevPos;
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
	 	},
	 	nextPanEntry: function() {
	 		if(crtPos + PAN_STEP < trip.length)
	 			return trip[crtPos + PAN_STEP];
	 		else
	 			return trip[trip.length - 1];
	 	},
	    images: function() {
	        return images;
	    },
	    tripDate: function() {
	    	return startDate;
	    },
	    tripDuration: function() {
	    	return endDate - startDate;
	    },
	    ascent: function() {
	    	return ascent;
	    },
	    descent: function() {
	    	return descent;
	    }
	};

}]);