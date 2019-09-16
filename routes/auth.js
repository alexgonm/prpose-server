const { logIn, logOut, register } = require('../controllers/auth');
const router = require('express').Router();

router
	.post('/login', (req, res) => {
		if (req.session.isLoggedIn) {
			res.sendStatus(401);
		} else {
			logIn(req.body, (err, result) => {
				if (err) {
					console.error(err);
					res.sendStatus(500);
				} else if (result) {
					//
					req.session.username = result;
					req.session.isLoggedIn = true;
					res.sendStatus(200);
				} else {
					//Wrong credentials
					res.sendStatus(401);
				}
			});
		}
	})

	.post('/register', (req, res) => {
		if (req.session.isLoggedIn) {
			res.sendStatus(401);
		} else {
			register(req.body, (err, result) => {
				if (err) {
					//console.error(err);
					res.send(err);
				} else {
					res.sendStatus(200);
				}
			});
		}
	})

	.post('/logout', logOut);

module.exports = router;
