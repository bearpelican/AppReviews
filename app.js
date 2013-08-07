
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);



app.get('/json/apps', api.apps);

// JSON API

app.get('/api/apps', api.apps);

app.get('/api/app/:_id', api.app);
app.post('/api/app', api.addApp);
app.put('/api/app/:_id', api.editApp);
app.delete('/api/app/:_id', api.deleteApp);

// Reviews

app.get('/api/app/:_id/pageReviews', api.pageReviews)
app.get('/api/app/:_id/pageReviews/:_after', api.pageReviews);
app.get('/api/app/:_id/reviews', api.reviews);
app.get('/api/review/:_id', api.review);
app.post('/api/review', api.addReview);
app.post('/api/reviews', api.addReviews);
// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
