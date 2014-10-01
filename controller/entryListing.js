angular.module('app').controller('EntryListingController', ['$scope', 'MapService', function($scope, MapService) {
  
	$scope.test;

	var init = function () {
		//$scope.test = MapService.current();
		console.log('look at me!');
	}

	init();
}]);