const router = require('express').Router();
const Post = require('../controllers/posts');

router
	.get('/', (req, res) => {
		Post.findAll(req.query, (err, results) => {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else if (results) {
				res.send(results);
			}
		});
	})
	.route('/:postID')
	.get((req, res) => {
		Post.findOne(req.params, (err, results) => {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else if (results) {
				res.send(results);
			} else {
				res.sendStatus(404);
			}
		});
	})
	.delete((req, res) => {});

router
	//
	.get('/:postID/comments', (req, res) => {
		Post.getCommentsOfPost();
	})
	//
	.get('/:postID/themes', (req, res) => {})
	.get('/:postID/posts', (req, res) => {})
	//
	.get('/:postID/upvotes', (req, res) => {})
	//
	.get('/:postID/downvotes', (req, res) => {})
	//
	.get('/:postID/voteState', (req, res) => {})
	//
	.post('/new-post', (req, res) => {})
	//
	.post('/new-child-post', (req, res) => {})
	//
	.post('/:postID/upvote', (req, res) => {})
	//
	.post('/:postID/downvote', (req, res) => {});

module.exports = router;
