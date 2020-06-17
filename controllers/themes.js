const db = require('../models/database').promise();

exports.findAll = (cb) => {
	const query = 'SELECT * FROM themes';

	db.query(query)
		.then((rows) => {
			if (rows[0].length === 0) {
				return cb(null, false);
			}
			cb(null, rows[0]);
		})
		.catch((error) => cb(error));
};

exports.findOne = (params, cb) => {
	const theme = params.theme,
		query = ' SELECT * FROM themes WHERE theme_name = ?';

	db.execute(query, [theme])
		.then((rows) => {
			if (rows[0].length === 0) {
				return cb(null, false);
			}
			cb(null, rows[0]);
		})
		.catch((error) => {
			return cb(error);
		});
};

exports.findPosts = ({ params, queryUrl }, cb) => {
	//TODO: fix queryUrl access
	if (!queryUrl || !(queryUrl.offset || queryUrl.limit)) {
		queryUrl.offset = 0;
		queryUrl.limit = 25;
		queryUrl.order = 'best';
	}
	//TODO: add comments for each query
	let query;
	const theme = params.theme;
	switch (queryUrl.order) {
		case 'new':
			//Get the new posts from a theme
			query =
				'SELECT posts.* FROM posts, post_theme, themes WHERE posts.post_id = post_theme.post_id AND themes.theme_name = post_theme.theme_name AND themes.theme_name = ? ORDER BY posts.publication_date DESC LIMIT ?, ?';

			break;
		case 'top':
			//Get the top voted posts of all time
			const subQuery1 = `SELECT post_id, count(*) AS positive 
						FROM post_vote 
						WHERE post_vote.upvote = 1 
						GROUP BY post_id`,
				//
				subQuery2 =
					'SELECT post_id, count(*) AS total FROM post_vote GROUP BY post_id';

			//
			query = `SELECT posts.*, u.positive, (t.total - u.positive) AS negative 
					FROM (posts, post_theme, themes)
					INNER JOIN (${subQuery1}) u ON u.post_id = posts.post_id 
					INNER JOIN (${subQuery2}) t ON t.post_id = posts.post_id 
					WHERE posts.post_id = post_theme.post_id AND themes.theme_name = post_theme.theme_name AND post_theme.theme_name = ? 
					ORDER BY u.positive DESC LIMIT ?, ?;`;
			break;
		default:
		case 'best':
			//
			subQuery1 =
				'SELECT post_id, count(*) AS positive FROM post_vote WHERE post_vote.upvote = 1 GROUP BY post_id';
			//
			subQuery2 =
				'SELECT post_id, count(*) AS total FROM post_vote GROUP BY post_id';

			//Re-Implementation of Evan Miller's rating algorithm
			//https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
			query = `SELECT posts.*, u.positive, (t.total - u.positive) AS negative, ((u.positive + 1.9208) / (u.positive + (t.total - u.positive)) - 1.96 * SQRT((u.positive * (t.total - u.positive)) / (u.positive + (t.total - u.positive)) + 0.9604) / (u.positive + (t.total - u.positive))) / (1 + 3.8416 / (u.positive + (t.total - u.positive))) AS ci_lower_bound 
				FROM (posts, post_theme, themes) 
				INNER JOIN (${subQuery1}) u ON u.post_id = posts.post_id 
				INNER JOIN (${subQuery2}) t ON t.post_id = posts.post_id 
				WHERE  (u.positive + (t.total - u.positive) > 0) 
				AND post_theme.post_id = posts.post_id AND themes.theme = post_theme.theme AND post_theme.theme = ?
				ORDER BY ci_lower_bound DESC, publication_date DESC;`;

			break;
	}

	db.execute(query, [theme, queryUrl.offset, queryUrl.limit])
		.then((rows) => {
			if (rows[0].length === 0) {
				return cb(null, false);
			}
			cb(null, rows[0]);
		})
		.catch((error) => cb(error));
};
