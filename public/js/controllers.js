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
    $http.get('api/app/' + $routeParams.id).
	success(function(data) {
	    $scope.app = data.app;
	});
}

function EditAppCtrl($scope, $http, $location, $routeParams) {
    $scope.form = {}
    $http.get('/api/app/' + $routeParams.id).
	success(function(data) {
	    $scope.form = data.app;
	})
    $scope.editApp = function() {
	$http.put('/api/app/' + $routeParams.id, $scope.form).
	    success(function(data) {
		$location.url('/viewApp/' + $routeParams.id);
	    });
    };
}

function DeleteAppCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/app/' + $routeParams.id).
	success(function(data) {
	    $scope.app = data.app;
	});
    $scope.deleteApp = function() {
	$http.delete('/api/app' + $routeParams.id).
	    success(function(data) {
		$location.url('/');
	    });
    };

    $scope.home = function() {
	$location.url('/');
    };
}

function ReviewsCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/app/' + $routeParams.id + '/reviews').
	success(function(data) {
	    $scope.reviews = data.reviews;
	});
}

function ReviewCtrl($scope, $http, $location, $routeParams) {
    $http.get('/api/review/' + $routeParams.id).
	success(function(data) {
	    $scope.review = data.review;
	});
}
