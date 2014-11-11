	
angular.module('app').directive('fbxElevationDiagram', ['$rootScope', 'MapService', function(rootScope, MapService) {
	return {
		link: function(scope, element, attrs) {
			var map, chart, titleChart, elevator, data;
				
			var chartOptions = {
				height: 60,
				width:300,
				legend: 'none',
				pointSize: 0,
				curveType: "function",
				enableInteractivity: false,
				chartArea: {
					left:5,
					top:5,
					height:55,
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
						0:{color: '#333', visibleInLegend: false, lineWidth: 1, areaOpacity:0.15},
         			1:{color: '#f44336', visibleInLegend: false, lineWidth: 2},
         			2:{color: '#f44336', visibleInLegend: false, pointSize: 5}
         		}
			}

			var titleChartOptions = {
				height: 250,
				width:700,
				legend: 'none',
				pointSize: 0,
				curveType: "function",
				enableInteractivity: false,
				chartArea: {
					backgroundColor: 'white'
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

			function init() {
				/* elevator = new google.maps.ElevationService(); */
				chart = new google.visualization.AreaChart(document.getElementById('fbx_diagram'));
				titleChart = new google.visualization.AreaChart(document.getElementById('fbx_titleDiagram'));
				fillDataTable();

				// Draw the chart using the data within its DIV.
				chart.draw(data, chartOptions);

				var fixedData = data;
				fixedData.setCell(0, 3, null);
				titleChart.draw(fixedData, titleChartOptions);
			}

			function fillDataTable() {

				data = new google.visualization.DataTable();
				data.addColumn('number', 'X');
				data.addColumn('number', 'Elevation1');
				data.addColumn('number', 'Elevation2');
				data.addColumn('number', 'Point');

				for (var i = 0; i < MapService.all().length; i++) {
					var elevation = MapService.entryAt(i).elevation;

					data.addRow([i, 
						(i >= MapService.currentPos() ? elevation : null),
						(i < MapService.currentPos() ? elevation : null),
						(i == MapService.currentPos() ? elevation : null)]);
				}
			}

  			scope.$on('crtPosChanged', function(event, args) {
  				
				var elevation = MapService.current().elevation, previousElevation = MapService.previous().elevation;
  				
  				data.setCell(MapService.previousPos(), 3, null);

  				if(args.next){
	  				data.setCell(MapService.previousPos(), 1, null);
	  				data.setCell(MapService.previousPos(), 2, previousElevation);
	  				data.setCell(MapService.currentPos(), 2, elevation);
  					data.setCell(MapService.currentPos(), 3, elevation);
  				}
  				else
  				{
	  				data.setCell(MapService.previousPos(), 1, previousElevation);
	  				data.setCell(MapService.currentPos(), 1, elevation);
	  				data.setCell(MapService.previousPos(), 2, null);
  					data.setCell(MapService.currentPos(), 3, elevation);
  				}


  				//data.setCell(MapService.previousPos(), 0, MapService.previousPos() < MapService.currentPos() ? null : previousElevation); 
				chart.draw(data, chartOptions);
  			});

			$(document).ready(function(){
				if(MapService.all().length > 0)
					init();
			});

			scope.$on('trackLoaded', function(){
				if (document.readyState == 'complete')
					init();
			});
		}
	}
}]);