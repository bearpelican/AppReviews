'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
	templateUrl: 'partials/index', 
	controller: IndexCtrl
    });
    $routeProvider.when('/addApp', {templateUrl: 'partials/addApp', controller: AddAppCtrl});
    $routeProvider.when('/app/:id/reviews', {templateUrl: 'partials/reviews', controller: ReviewsCtrl});
    $routeProvider.when('/editApp/:id', {templateUrl: 'partials/editApp', controller: EditAppCtrl});
    $routeProvider.when('/deleteApp/:id', {templateUrl: 'partials/deleteApp', controller: DeleteAppCtrl});
    $routeProvider.when('/review/:id', {templateUrl: 'partials/review', controller: ReviewCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);
