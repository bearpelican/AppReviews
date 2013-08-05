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

function ReviewsCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/app/' + $routeParams._id + '/reviews').
	success(function(data) {
	    $scope.reviews = data.reviews;
	    $scope.app = data.app;
	});
}

function PageReviewsCtrl($scope, PageReviews) {
    $scope.reviews = new PageReviews();
};

function ReviewCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/review/' + $routeParams._id).
	success(function(data) {
	    $scope.review = data.review;
	});
}


function ReviewsScrollCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/app/' + $routeParams)
}

