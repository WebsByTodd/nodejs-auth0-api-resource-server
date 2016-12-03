var express         	= require('express');
var jwt								= require('express-jwt');
var jwks 							= require('jwks-rsa');
var config						= require('./config');
var port              = process.env.PORT || 4000;
var app               = express();

var jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: config.auth0jwksUri
	}),
	algorithms: ['RS256']
});

app.use(jwtCheck);

app.get('/', function(req, res) {
		res.status(200).send({
			message: "Successfully authenticated to API"
		});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500)
			.json({
				message: err.message,
				error: err
			});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
		.json({
			error: {}
		});
});

module.exports = app;