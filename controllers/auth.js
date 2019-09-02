const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt'),
	user = require('./users');

passport.use(
	new LocalStrategy(async function(username, password, done) {
		user.findByUsername({ username: username }, async function(err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}

			try {
				const match = await bcrypt.compare(password, user.password);
				if (!match) {
					return done(null, false, {
						message: 'Incorrect password.'
					});
				}
				return done(null, user);
			} catch (err) {
				//soit retry soit envoie erreur
				// console.error(err)
				return done(err);
			}
		});
	})
);

passport.serializeUser(function(user, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function(username, callback) {
	User.findByUsername(username, function(err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	});
});

module.exports = passport;
