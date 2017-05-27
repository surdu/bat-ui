var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('./passport')

var User = require("../models/user");

router.get('/register', function(req, res) {
	res.render('register.html');
});

router.post('/register', function(req, res) {
	bcrypt.genSalt(function(err, salt)
	{
		bcrypt.hash(req.body.password, salt, function(err, hash)
		{
			User({
				email: req.body.email,
				password: hash
			}).save(function (err) {
				if (err) {
					throw err;
				}

				req.flash('success', 'User created');
				res.redirect('/');
			});
		});
	});
});




router.get('/login', function(req, res) {
	res.render('login.html');
});

router.post('/login', function (req, res, next) {

	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (!user) {
			req.flash('danger', info.message);
			return res.redirect('/user/login');
		}

		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}

			return res.redirect('/');
		});

	})(req, res, next);

});


router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;
