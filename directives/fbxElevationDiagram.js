	
angular.module('app').directive('fbxElevationDiagram', ['$rootScope', 'fbxService', 'config', function(rootScope, fbxService, config) {
	return {
		link: function(scope, element, attrs) {
			var map, chart, titleChart, elevator, data, currentPos = 0;

			function init() {
				console.log("init called");
				chart = new google.visualization.AreaChart(document.getElementById('fbx_diagram'));
				titleChart = new google.visualization.AreaChart($('#fbx_titleDiagram > div')[0]);
				initializeTable();
				fillDataTable();
				chart.draw(data, config.chartOptions);

				var fixedData = data;
				fixedData.setCell(0, 3, null);
				titleChart.draw(fixedData, config.titleChartOptions);
				console.log("drawed with " + fbxService.all().length + " data points");
			}

			function initializeTable() {

				data = new google.visualization.DataTable();
				data.addColumn('number', 'X');
				data.addColumn('number', 'Elevation1');
				data.addColumn('number', 'Elevation2');
				data.addColumn('number', 'Point');
			}

			function fillDataTable() {

				for (var i = 0; i < fbxService.all().length; i++) {
					var elevation = fbxService.entryAt(i).elevation;

					data.addRow([i, 
						(i >= currentPos ? elevation : null),
						(i <= currentPos ? elevation : null),
						(i == currentPos ? elevation : null)]);
				}
			}

  			scope.$on('crtPosChanged', function(event, args) {

  				var newPos = args.next ? currentPos + 1 : currentPos - 1;
				var currentPoint = fbxService.entryAt(currentPos);
				var newPoint = fbxService.entryAt(newPos);

				if(currentPos != fbxService.currentPos()) {

					data.setCell(currentPos, 3, null);

	  				if(args.next){
		  				data.setCell(currentPos, 1, null);
		  				data.setCell(currentPos, 2, currentPoint.Elevation);
		  				data.setCell(newPos, 2, newPoint.elevation);
	  					data.setCell(newPos, 3, newPoint.elevation);
	  				}
	  				else
	  				{
		  				data.setCell(currentPos, 1, currentPoint.Elevation);
		  				data.setCell(newPos, 1, newPoint.elevation);
		  				data.setCell(currentPos, 2, null);
	  					data.setCell(newPos, 3, newPoint.elevation);
	  				}

	  				currentPos = newPos;
	  				chart.draw(data, config.chartOptions);
	  			}
  			});

  			scope.$on('jumpTo', function(event, args) {

  				if(currentPos != args.pos) {
	  				currentPos = args.pos;
	  				initializeTable();
	  				fillDataTable();
	  				chart.draw(data, config.chartOptions);
	  			}
  			});

			scope.$on('trackLoaded', function(){
				init();
			});
		}
	}
}]);