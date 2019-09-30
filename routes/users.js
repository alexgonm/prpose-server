const User = require('../controllers/users'),
	router = require('express').Router();

router
	.get('/', (req, res) => {
		const { query } = req;
		User.findAll(query, (err, results) => {
			if (err) {
				res.status(500).send(err);
			} //else if (!results) {
			// 	res.sendStatus(404);
			// }
			res.send(results);
		});
	})
	.get('/:username', (req, res) => {
		const { params, session } = req;

		User.findOne({ params, session }, (err, results) => {
			if (err) {
				res.status(500).send(err);
			} else if (!results) {
				res.sendStatus(404);
			}
			res.send(results);
		});
	})
	.get('/:username/posts', (req, res) => {
		const { params, query } = req;
		User.findPosts({ params, query }, (err, results) => {
			if (err) {
				res.status(500).send(err);
			} else if (!results) {
				res.sendStatus(404);
			}
			res.send(results);
		});
	})
	.get('/:username/comments', (req, res) => {
		const { params, query } = req;
		User.findComments({ params, query }, (err, results) => {
			if (err) {
				res.status(500).send(err);
			} else if (!results) {
				res.sendStatus(404);
			}
			res.send(results);
		});
	})
	.get('/:username/votes', (req, res) => {
		if (!req.session.username) {
			res.sendStatus(401);
		}
		const { session, query } = req;

		User.findVotes({ query, session }, (err, results) => {
			if (err) {
				res.status(500).send(err);
			}
			if (!results) {
				res.sendStatus(404);
			} else {
				res.send(results);
			}
		});
	});

module.exports = router;
