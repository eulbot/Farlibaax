

$(function() {

    $.trip = [];
    $.crtPos = 0;

    $.trip.push({lat:46.7970306, lng:10.7291944});
    $.trip.push({lat:46.7973222, lng:10.7282722});
    $.trip.push({lat:46.7971306, lng:10.7271944});
    $.trip.push({lat:46.7975222, lng:10.7232722});

    $('#scaffold').bind('mousewheel DOMMouseScroll', function(e){
        
        if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0)
            $.crtPos++;
        else 
            $.crtPos--;
        
        if ($.crtPos == $.trip.length)
            $.crtPos = 0;

        if ($.crtPos < 0) 
            $.crtPos = $.trip.length -1;

        moveMap();
    });

    /* $('#scaffold').click(function(e) {
        e.preventDefault();
    }); */
     
});



function init() {

    var mapOptions = {
        zoom: 13, // initialize zoom level - the max value is 21
        streetViewControl: false, // hide the yellow Street View pegman
        navigationControl: false,
        scaleControl: false, // allow users to zoom the Google Map
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        center: new google.maps.LatLng($.trip[0].lat, $.trip[0].lng)
    };
 
    map = new google.maps.Map(document.getElementById('maps'), mapOptions);
    
    // google.maps.event.addDomListener(window, 'load', showGoogleMaps);
}

function moveMap() {
    if(map) {
        map.panTo(new google.maps.LatLng( $.trip[$.crtPos].lat, $.trip[$.crtPos].lng ) );
        map.setZoom(15);
    }
}