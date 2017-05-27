var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var User = require("../models/user");

passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		User.find({"email": email}, function (err, users) {
			if (err) {
				throw err;
			}

			if (users.length !== 0) {
				user = users[0];
			}
			else {
				return done(null, false, { message: 'Incorrect username or password.' });
			}

			if (!bcrypt.compareSync(password, user.password)) {
				return done(null, false, { message: 'Incorrect username or password.' });
			}

			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(null, user);
	});
});

module.exports = passport
