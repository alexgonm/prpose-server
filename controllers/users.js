const db = require('../models/database').promise();

const User = {
	findAll(queryUrl, cb) {
		if (Object.keys(queryUrl).length === 0) {
			queryUrl.offset = 0;
			queryUrl.limit = 25;
		}

		const query = 'SELECT user_id, username FROM users LIMIT ?, ?';

		db.execute(query, [queryUrl.offset, queryUrl.limit])
			.then((rows, fields) => {
				if (rows[0].length === 0) {
					return cb(null, false);
				}
				cb(null, rows[0]);
			})
			.catch(error => {
				return cb(error);
			});
	},
	// findSome(username, cb) {
	// 	const query = '';
	// },
	findOne({ params, session }, cb) {
		const query = session.username
			? 'SELECT user_id, username, email, creation_date FROM users WHERE username = ?;'
			: 'SELECT user_id, username, creation_date FROM users WHERE username = ?;';

		const username = params.username;

		db.execute(query, [username])
			.then((rows, fields) => {
				if (rows[0].length === 0) {
					return cb(null, false);
				}
				cb(null, rows[0]);
			})
			.catch(error => {
				return cb(error);
			});
	},

	findPosts({ params, queryUrl }, cb) {
		//TODO: add options from req.query
		//TODO: add the order types (best, top, new)
		const query =
			'SELECT posts.* FROM posts, users WHERE users.username = posts.username AND users.username = ?';

		const username = params.username;

		db.execute(query, [username])
			.then((rows, fields) => {
				if (rows[0].length === 0) {
					return cb(null, false);
				}
				cb(null, rows[0]);
			})
			.catch(error => {
				return cb(error);
			});
	},
	findComments({ params, queryUrl }, cb) {
		if (Object.keys(queryUrl).length === 0) {
			queryUrl.offset = 0;
			queryUrl.limit = 25;
			queryUrl.order = 'new';
		}

		//TODO: use the options from queryUrl, add the order types (best, top, new)
		const query =
			'SELECT comments.* FROM comments, users WHERE users.username = comments.username AND users.username = ?';
		const username = params.username;

		db.execute(query, [username])
			.then(rows => {
				if (rows[0].length === 0) {
					return cb(null, false);
				}
				cb(null, rows[0]);
			})
			.catch(error => {
				return cb(error);
			});
	},
	findVotes({ queryUrl, session }, cb) {
		if (Object.keys(queryUrl).length === 0) {
			queryUrl.offset = 0;
			queryUrl.limit = 25;
			queryUrl.order = 'desc';
		}

		//TODO: finish this query
		const query = 'SELECT FROM WHERE ';

		db.execute(query, [
			session.username,
			queryUrl.order,
			queryUrl.offset,
			queryUrl.limit
		])
			.then(rows => {
				if (rows[0].length === 0) {
					return cb(null, false);
				}
				cb(null, rows[0]);
			})
			.catch(error => cb(error));
	}
};

module.exports = User;
