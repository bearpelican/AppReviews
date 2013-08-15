'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myApp = angular.module('myApp.services', ['infinite-scroll']);

myApp.value('version', '0.1');

//var myApp angular.module('myApp.services', ['infinite-scroll']);

myApp.factory('PageReviews', function($http, $routeParams) {
    var PageReviews = function() {
	this.pageReviews = [];
	this.busy = false;
	this.after = '';
    };

    PageReviews.prototype.nextPage = function() {
	if (this.busy) return;
	this.busy = true;
	var url = '/api/app/' + $routeParams._id + '/pageReviews/' + this.after;
	$http.get(url).success(function(data) {
	    var pageReviews = data.pageReviews;
	    this.pageReviews.push.apply(this.pageReviews, pageReviews);
	    this.after = this.pageReviews[this.pageReviews.length - 1]._id;
	    this.busy = false;
	}.bind(this));
    };
    return PageReviews;
});

myApp.directive('bearpelican', function() {
    return {
	retrict: 'A',
	link: function (scope, element, attrs) {
	    console.log("JDFSKLFSJ LKFJSDF LKSDJF SD");
	    console.log("ATTRS ARE: ", attrs);
	    console.log("Scope is: ", scope);
	    scope.$watch("reviewGraph.busy", function(val) {
		element.jQCloud(scope.reviewGraph.wordArray);
	    }, true)

	}
    }
});

myApp.factory('ReviewGraph', function($http, $routeParams) {
    var ReviewGraph = function() {
	this.reviews = [];
	this.titles = [];
	this.comments = [];
	this.freq = {};
	this.wordArray = [];
	this.busy = false;
	this.word_list = [];
	this.asdf = '';
    };

    ReviewGraph.prototype.populateReviews = function() {
	this.asdf = 'asdfasdf';
	if (this.busy) return;
	this.busy = true;
	var url = '/api/app/' + $routeParams._id + '/reviewGraph/';
	$http.get(url).success(function(data) {
	    this.reviews = data.reviews;
	    for (var i = 0; i < this.reviews.length; i++) {
		var review = this.reviews[i];
		this.titles.push(review.title);
		this.comments.push(review.comment);
	    }
	    this.freq = wordFrequency(this.comments.toString());
	    this.wordArray = wordArray(this.freq);
	    this.busy = false;


	    this.word_list = [
		{text: "Lorem", weight: 15},
		{text: "Ipsum", weight: 9, link: "http://jquery.com/"},
		{text: "Dolor", weight: 6},
		{text: "Sit", weight: 7},
		{text: "Amet", weight: 5}
		// ...other words
	    ];
	}.bind(this));
    }

    function wordFrequency(text) {
	var words = text.toLowerCase().split(/[\s,.]+/);
	var freq = {};
	for (var i = 0; i < words.length; i++) {
	    var word = words[i];
	    if (typeof freq[word] === 'number') {
		freq[word] += 1;
	    }
	    else {
		freq[word] = 1;
	    }
	}
	return freq;
    }
    
    function wordArray(freq) {
	var array = [];
	for (var wordKey in freq) {
	    var frequencyNumber = freq[wordKey];
	    if (frequencyNumber > 2) {
		var textWeight = {text: wordKey, weight: frequencyNumber};
//		console.log("Text weight: " + textWeight);
		array.push(textWeight);
	    }
	}
	return array;
    }
/*    ReviewGraph.prototype.wordFrequency = function() {
	var text = this.titles.toString();
	var words = text.toLowerCase().split(/[\s,.]+/);
	this.freq = {};
	for (i = 0; i < words.length; i += 1) {
	    word = words[i];
	    if (typeof this.freq[word] === 'number') {
		this.freq[word] += 1;
	    } else {
		this.freq[word] = 1;
	    }
	}
    }*/
    return ReviewGraph;
});

