/*
 * Serve JSON to our AngularJS client
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/appreviews');

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
    appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App' },
    /*hashId: { type: String,
	      unique: true}*/
})

reviewSchema.index({ "title": 1, "comment":1, "version": 1, "authorId": 1}, { unique: true });

var rankingSchema = mongoose.Schema({
    rank: Number,
    date: Date,
    device: String,
    genre: String,
    list: String,
    platform: String,
    version: String,
    country: String,
    appName: { type:String, ref: 'App'},
    appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App' }
})


var appSchema = mongoose.Schema({
    name: String,
    description: String,
    iosId: String,
    androidId: String,
    lastSyncTime: Date,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
})

var App = mongoose.model('App', appSchema);
var Review = mongoose.model('Review', reviewSchema)
var Ranking = mongoose.model('Ranking', rankingSchema)


var db = mongoose.connection;
mongoose.set('debug', true)
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback () {
    console.log('DB connection open');
});

handleError = function(error) {
    console.log('error:' + error);
}
// GET

exports.apps = function (req, res) {
    App.find({}, function (err, apps) {
	res.json({
	    apps: apps
	});
    });
};

exports.app = function (req, res) {
    var id = req.params._id;
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
    var id = req.params._id;
    App.findById(id, function (err, app) {
	var bodyRequest = req.body;
	delete bodyRequest._id;
	delete bodyRequest.__v;
	delete bodyRequest.reviews;
	console.log(bodyRequest);
	app.update(bodyRequest, function (err, numberAffected, raw) {
	    if (err) return handleError(err);
	    console.log('Success');
	    res.json(true);
	});
    });
};

// DELETE
exports.deleteApp = function (req, res) {
    var id = req.params._id;
    App.findByIdAndRemove(id, function (err, doc) {
	if (err) return handleError(err);
	res.json(true);
    });
};

// REVIEW GRAPH

exports.reviewGraph = function (req, res) {
    var id = req.params._id;
    App.findById(id, function (err, app) {
//	var query = {'appId' : id}
	var query = {'appId' : id, $or:[{country:"United States"}, {platform:"Android"}]};
	Review.find(query, { title: 1, comment:1 }).limit(100).exec(function (err, reviews) {
	    if (err) return handleError(err);
	    res.json({
		reviews: reviews,
		app: app
	    })
	})
	
    })

    App.findById(id, function (err, app) {
	if (err) return handleError(err);
	
    })
}

// RANKINGS

exports.ranking = function (req, res) {
    var id = req.params._id;
    Ranking.findById(id, function (err, ranking) {
	res.json({
	    ranking: ranking
	});
    });
}

exports.rankings = function (req, res) {
    var id = req.params._id;
    App.findById(id, function (err, app) {
	Ranking.find({'appId': id}).exec(function (err, rankings) {
	    if (err) return handleError(err);
	    res.json({
		rankings: rankings,
		app: app
	    })
	})
	
    })
}

exports.latestRanking = function (req, res) {
    var id = req.params._id;
    App.findById(id, function (err, app) {
	Ranking.find({'appId':id}).limit(1).exec(function (err, ranking) {
	    if (err) return handleError(err);
	    res.json({
		ranking: ranking,
		app: app
	    })
	})
    })
}

exports.addRankings = function(req, res) {
    var rankings = req.body.rankings;
    var jsonRankings = rankings;
    try
    {
	jsonRankings = JSON.parse(rankings);
    }
    catch (err) {}
    jsonRankings.forEach(function(item, index) {
	Ranking.create(item, function(err, review) {
	    if (err) return handleError(err);
	    ranking.save(function (err) {
		if (err) return handleError(err);
	    })
	})
    })
    res.json(true);
}


// REVIEWS
exports.review = function (req, res) {
    var id = req.params._id;
    Review.findById(id, function (err, review) {
	res.json({
	    review: review
	});
    });
}

exports.addReviews = function (req, res) {
    var reviews = req.body.comments;
    console.log(req.body.comments);
    var jsonReviews = reviews;
    try 
    {
	jsonReviews = JSON.parse(reviews);
    }
    catch (err) {}
/*    Review.create(jsonReviews, function (err) {
	if (err) return handleError(err);
    })*/
    jsonReviews.forEach(function(item, index) {
	Review.create(item, function(err, review) {
	    if (err) return handleError(err);
	    review.save(function (err) {
		if (err) return handleError(err);
	    })
	})
    })
    res.json(true);

}

exports.reviews = function (req, res) {
    var id = req.params._id;
    App.findById(id, function (err, app) {
	Review.find({'appId': id}).exec(function (err, reviews) {
	    if (err) return handleError(err);
	    res.json({
		reviews: reviews,
		app: app
	    })
	})
	
    })
};

exports.pageReviews = function (req, res) {
    var id = req.params._id;
    var review_id = req.params._after;
    console.log(req.params)
    App.findById(id, function (err, app) {
//db.reviews.find({$or:[{country:"United States"}, {platform:"Android")
	var query = {'appId' : id, $or:[{country:"United States"}, {platform:"Android"}]};
	if (review_id != undefined) query["_id"] = { $gt : review_id };

	Review.find(query).limit(10).exec(function (err, reviews) {
	    if (err) return handleError(err);
	    res.json({
		pageReviews: reviews,
		app: app
	    })
	})
	
    })
};


exports.addReview = function (req, res) {
    var review = new Review(req.body);
    review.save(function (err) {
	if (err) return handleError(err);
        res.json(req.body);
    });
}
