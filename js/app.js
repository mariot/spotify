var myApp = angular.module('myApp', [
  'ngRoute',
  'musicServices',
  'musicControllers'
]);

myApp.config(function($routeProvider) {
  $routeProvider.
  when('/search', {
    templateUrl: 'partials/search.html',
    controller: 'SearchController'
  }).
  when('/artist/:artistId', {
    templateUrl: 'partials/artist.html',
    controller: 'ArtistDetailsController'
  }).
  otherwise({
    redirectTo: '/search'
  });
});
