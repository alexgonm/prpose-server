const db = require('../models/database').promise();
const bcrypt = require('bcrypt');
const moment = require('moment');

exports.logIn = (userInformations, cb) => {
	// Assuming the client checks on whether an email or a simple username has been entered

	// Using the email as an identifier if the email has been sent, otherwise it will be the username
	process.nextTick(async () => {
		const userIdentifer = userInformations.email
			? userInformations.email
			: userInformations.username;

		const password = userInformations.password;

		//Query to send to database
		const query = userInformations.email
			? 'SELECT email, username, password FROM users WHERE email = ?'
			: ' SELECT email, username, password FROM users WHERE username = ?';

		try {
			const [rows] = await db.execute(query, [userIdentifer]);

			if (rows.length === 0) {
				cb(null, false); //No identifier found
			} else {
				//return username if right password
				const match = await bcrypt.compare(password, rows[0].password);

				if (match) {
					cb(null, rows[0].username);
				} else {
					cb(null, false);
				}
			}
		} catch (error) {
			return cb(error);
		}
	});
};

exports.register = (userInformations, cb) => {
	process.nextTick(async () => {
		const username = userInformations.username,
			email = userInformations.email,
			password = userInformations.password;

		//Checking if username and/or email address is already used by another account
		try {
			const [rows] = await db.execute(
				'SELECT username, email FROM users WHERE username = ? OR email = ?',
				[username, email]
			);

			if (rows.length > 0) {
				const errorMessages = {};
				let i;
				for (i = 0; i < rows.length; i++) {
					if (rows[i].username === username) {
						errorMessages.usernameError = 'taken';
					}
					if (rows[i].email === email) {
						errorMessages.emailError = 'taken';
					}
				}
				return cb(errorMessages, false);
			} else {
				const saltRounds = 10;
				try {
					bcrypt.hash(password, saltRounds).then(hash => {
						//TODO: make a transaction out of it
						const query =
							'INSERT INTO users(username, email, password, creation_date) VALUES (?, ?, ?, ?)';

						db.execute(query, [
							username,
							email,
							hash,
							moment().format('YYYY-MM-DD HH:mm:ss')
						])
							.then((rows, fields) => {
								//console.log(rows);
								return cb(null, username);
							})
							.catch(error => {
								return cb(error);
							});
					});
				} catch (error) {
					return cb(error);
				}
			}
		} catch (error) {
			return cb(error);
		}
	});
};

exports.logOut = (req, res) => {
	//Log out
	if (!req.session.isLoggedIn) {
		res.sendStatus(401);
	} else {
		//Destroying the session
		req.session.destroy(err => {
			if (err) {
				console.error(err);
			}
			res.sendStatus(200);
		});
	}
};
