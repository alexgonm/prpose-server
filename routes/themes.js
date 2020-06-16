const router = require('express').Router();
const Themes = require('../controllers/themes');

const usualRouteFunction = function (err, results) {
	//Here "this" will replace res object

	if (err) {
		console.error(err);
		//res.status(500).send(err)
		this.status(500).send(err);
	}
	if (!results) {
		this.sendStatus(404);
	}
	this.send(results);
};

router
	.get('/', (req, res) => {
		//Retrieve all themes
		Themes.findAll(usualRouteFunction.bind(res));
	})
	.get('/:theme', (req, res) => {
		//Get one theme
		const { params } = req;

		Themes.findOne(params, usualRouteFunction.bind(res));
	})
	.get('/:theme/posts', (req, res) => {
		//Get all posts of one theme
		const { params, query } = req;

		//Query contains sort settings
		Themes.findPosts({ params, query }, usualRouteFunction.bind(res));
	});

module.exports = router;
