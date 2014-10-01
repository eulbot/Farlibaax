
angular.module('app').directive('fbxElevationDiagram', ['$rootScope', 'MapService', function(rootScope, MapService) {
	return {
		link: function(scope, element, attrs) {
			var map, chart, elevator;
				
			var chartOptions = {
				height: 150,
				legend: 'none',
				curveType: 'function',
				lineWidth: 0.5,
				pointSize: 0
			}

			function init() {
				/* elevator = new google.maps.ElevationService(); */
				chart = new google.visualization.AreaChart(document.getElementById('fbx_diagram'));

				var data = new google.visualization.DataTable();
				data.addColumn('string', 'Sample');
				data.addColumn('number', 'Elevation');
				for (var i = 0; i < MapService.all().length; i++) {
					data.addRow(['', MapService.entryAt(i).elevation]);
				}

				// Draw the chart using the data within its DIV.
				document.getElementById('fbx_diagram').style.display = 'block';
				chart.draw(data, chartOptions);
			}

			scope.$on('trackLoaded', function(){
				if (document.readyState == 'complete')
					init();
			});

			$(document).ready(function(){
				if(MapService.all().length > 0)
					init();
			});
		}
	}
}]);