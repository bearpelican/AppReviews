/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/appreviews');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback () {
    console.log('DB connection open');
});

var reviewSchema = mongoose.Schema({
    title: String,
    comment: String,
    authorName: String,
    authorId: String,
    rating: Number,
    date: Date,
    url: String,
    platform: String,
    version: String,
    country: String,
    appName: { type:String, ref: 'App'},
    appID: { type: mongoose.Schema.Types.ObjectId, ref: 'App' }
})

var appSchema = mongoose.Schema({
    name: String,
    description: String,
    iosID: String,
    androidID: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
})

var App = mongoose.model('App', appSchema);
var Review = mongoose.model('Review', reviewSchema)


// GET

exports.apps = function (req, res) {
    App.find({}, function (err, apps) {
	res.json({
	    apps: apps
	});
    });
};

exports.app = function (req, res) {
    var id = req.params.id;
    App.findById(id, function (err, app) {
	res.json({
	    app: app
	});
    });
};

// POST
exports.addApp = function (req, res) {
    console.log("adding app: " + req);
    var app = new App(req.body);
    app.save(function (err) {
	if (err) return handleError(err);
	res.json(req.body);
    });
};

// PUT
exports.editApp = function (req, res) {
    var id = req.params.id;
    App.findById(id, function (err, app) {
	app.update(req.body, function (err, numberAffected, raw) {
	    if (err) return handleError(err);
	    console.log('Success');
	    res.json(true);
	});
    });
};

// DELETE
exports.deleteApp = function (req, res) {
    var id = req.params.id;
    App.findByIdAndRemove(id, function (err, doc) {
	if (err) return handleError(err);
	res.json(true);
    });
};


// REVIEWS
exports.review = function (req, res) {
    var id = req.params.id;
    Review.findById(id, function (err, review) {
	res.json({
	    review: review
	});
    });
}

exports.reviews = function (req, res) {
    var id = req.params.id;
    App.findById(id).populate('reviews').exec(function (err, reviews) {
	if (err) return handleError(err);
	res.json({
	    reviews: reviews
	});
    });
};

exports.addReview = function (req, res) {
    var review = new Review(req.body);
    review.save(function (err) {
	if (err) return handleError(err);
        res.json(req.body);
    });
}
