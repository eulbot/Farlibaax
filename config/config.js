(function () {
	'use strict';

	var app = angular.module('app');

	var colActive = '#f44336'
	, colInactive = '#333';

	var mapOptions = {
		zoom: 16, 
		zoomControl: true,
		zoomControlOptions: {
			//tyle: google.maps.ZoomControlStyle.LARGE,
			//position: google.maps.ControlPosition.RIGHT_TOP
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

	var chartOptions = {
		height: 90,
		width:300,
		legend: 'none',
		pointSize: 0,
		curveType: "function",
		enableInteractivity: false,
		chartArea: {
			top:5,
			left: 5,
			right: 0,
			height:75,
			width:295
		},
		tooltip: {
			trigger: 'none'},
		hAxis: {
			baselineColor: 'transparent',
			gridlines:{count:0}},
		vAxis: {
			baselineColor: 'transparent',
			textPosition:'none',
			gridlines:{count:0}
		},
		backgroundColor: { fill:'transparent' },
		series: {
			0:{color: '#eee', visibleInLegend: false, lineWidth: 1, areaOpacity:0.15},
 			1:{color: '#f44336', visibleInLegend: false, lineWidth: 2},
 			2:{color: '#f44336', visibleInLegend: false, pointSize: 5}
 		}
	}

	var titleChartOptions = {
		height: 220,
		width:700,
		legend: 'none',
		pointSize: 0,
		curveType: "function",
		enableInteractivity: false,
		chartArea: {
			backgroundColor: 'white',
			top:15,
			bottom: 15,
			height:190,
			left: 100,
			right: 100,
			width:500
		},
		hAxis: {
			gridlines:{count:0}},
			baselineColor: '#fff',
		vAxis: {
			baselineColor: '#fff',
			gridlines:{count:6, color:'#ddd'}
		},
		series: {
			0:{color: '#333', lineWidth: 2, areaOpacity:0.15},
 			1:{color: '#333', lineWidth: 2, areaOpacity:0.15}
 		}
	}

	var config = {
		colActive: colActive,
		colInactive: colInactive,
        mapOptions: mapOptions,
        photoIcon: photoIcon,
        markerOptions: markerOptions,
        lineOptions: lineOptions,
        chartOptions: chartOptions,
        titleChartOptions: titleChartOptions
    };

	app.value('config', config);

})();