'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

var myApp angular.module('myApp.services', ['infinite-scroll']);

myApp.factory('PageReviews', function($http, $routeParams)) {
    var PageReviews = function() {
	this.reviews = [];
	this.busy = false;
	this.after = '';
    };

    PageReviews.prototype.nextPage = function() {
	if (this.busy) return;
	this.busy = true;
	var url = '/api/app/' + $routeParams._id + '/pageReviews?after=' + this.after;
	$http.get(url).success(function(data) {
	    var reviews = data.review;
	    this.reviews.push.apply(this.reviews, reviews);
	    this.after = this.reviews[this.reviews.length - 1].id;
	    this.busy = false;
	}.bind(this));
    };
    return PageReviews;
}
