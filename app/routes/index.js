'use strict';

var path = process.cwd();
var YelpHandler = require(path + '/app/controllers/yelpHandler.server.js');

module.exports = function(app, passport) {
	var yelpHandler = new YelpHandler();

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			req.loggedIn = true;
			req.userId = req.user.github.id || req.user.twitter.id;
			req.displayName = req.user.github.displayName || 
				req.user.twitter.displayName;
		}
		else {
			req.loggedIn = false;
		};
		return next();
	}

	app.route('/')
		.get(isLoggedIn, function(req, res) {
			res.render('index.pug', {
				loggedIn: req.loggedIn,
				displayName : req.displayName
			});
		});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.route('/api/bar/:bar')
		.post(isLoggedIn,yelpHandler.going);

	app.route('/api/yelp/:place')
		.get(isLoggedIn,yelpHandler.search);

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/'
		}));

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/'
		}));

};
