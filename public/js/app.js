'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
	templateUrl: 'partials/index', 
	controller: IndexCtrl
    });
    $routeProvider.when('/addApp', {templateUrl: 'partials/addApp', controller: AddAppCtrl});
    $routeProvider.when('/app/:_id/reviews', {templateUrl: 'partials/reviews', controller: ReviewsCtrl});
    $routeProvider.when('/editApp/:_id', {templateUrl: 'partials/editApp', controller: EditAppCtrl});
    $routeProvider.when('/deleteApp/:_id', {templateUrl: 'partials/deleteApp', controller: DeleteAppCtrl});
    $routeProvider.when('/review/:_id', {templateUrl: 'partials/review', controller: ReviewCtrl});
    $routeProvider.when('/app/:_id/pageReviews', {templateUrl: 'partials/pageReviews', controller: PageReviewsCtrl});
//    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);

