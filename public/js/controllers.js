'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
    $http.get('/api/apps').
	success(function(data, status, headers, config) {
	    $scope.apps = data.apps;
	});
}

function AddAppCtrl($scope, $http, $location) {
    $scope.form = {};
    $scope.addApp = function () {
	$http.post('/api/app', $scope.form).
	    success(function(data) {
		console.log('adding data ' + $scope.form);
		$location.path('/');
	    });
    };
}

function ViewAppCtrl($scope, $http, $routeParams) {
    $http.get('api/app/' + $routeParams._id).
	success(function(data) {
	    $scope.app = data.app;
	});
}

function EditAppCtrl($scope, $http, $location, $routeParams) {
    $scope.form = {}
    $http.get('/api/app/' + $routeParams._id).
	success(function(data) {
	    $scope.form = data.app;
	})
    $scope.editApp = function() {
	$http.put('/api/app/' + $routeParams._id, $scope.form).
	    success(function(data) {
		$location.url('/viewApp/' + $routeParams._id);
	    });
    };
}

function DeleteAppCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/app/' + $routeParams._id).
	success(function(data) {
	    $scope.app = data.app;
	});
    $scope.deleteApp = function() {
	$http.delete('/api/app' + $routeParams._id).
	    success(function(data) {
		$location.url('/');
	    });
    };

    $scope.home = function() {
	$location.url('/');
    };
}

function AppHomeCtrl($scope, $http, ReviewGraph, $routeParams) {
    $scope.reviewGraph = new ReviewGraph();
    $http.get('/api/app/' + $routeParams._id + '/averageReviews').
	success(function(data) {
	    $scope.average = data.average.toFixed(2);
	    $scope.change = data.change;
	    $scope.app = data.app;
	});
    $http.get('/api/app/latestRanking/' + $routeParams._id).
	success(function(data) {
	    $scope.ranking = data.ranking.rank;
	    $scope.rankingChange = data.change;
	});
}

function ReviewGraphCtrl($scope, ReviewGraph) {
    $scope.reviewGraph = new ReviewGraph();
};

function ReviewsCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/app/' + $routeParams._id + '/reviews').
	success(function(data) {
	    $scope.reviews = data.reviews;
	    $scope.app = data.app;
	});
}

function PageReviewsCtrl($scope, PageReviews) {
    $scope.pageReviews = new PageReviews();
};

function ReviewCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/review/' + $routeParams._id).
	success(function(data) {
	    $scope.review = data.review;
	});
}

