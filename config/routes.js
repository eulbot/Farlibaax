angular.module('app').config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  /*$routeProvider.
    when('/', {
      templateUrl: '../views/entryListing.html',
      controller: 'EntryListingController'
    }).
    when('/about', {
      templateUrl: '../views/about.html'
    }).
    otherwise({
      redirectTo: '/'
    });*/
});