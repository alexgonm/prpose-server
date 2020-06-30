const db = require('../models/database').promise();

exports.findAll = async (queryUrl, cb) => {
	let sort = 'best',
		limit = 25,
		offset = 0;
	if (queryUrl) {
		sort = queryUrl.sort;
		offset = queryUrl.offset;
		limit = queryUrl.limit;
	}
	let sqlQuery;
	switch (sort) {
		//Sorting per most recent
		case 'new':
			sqlQuery =
				'SELECT * FROM posts ORDER BY publication_date DESC, publication_hour DESC';

			break;
		//Sorting per most upvoted post
		case 'top':
			sqlQuery =
				'SELECT posts.*, count(post_vote.post_id) as upvotes FROM posts, post_vote WHERE posts.post_id = post_vote.post_id GROUP BY posts.post_id ORDER BY upvotes DESC';

			break;
		//Sorting per most upvoted per day (+ taking into account downvotes)
		default:
		case 'best':
			const subSqlQuery1 =
				'SELECT post_id, count(*) AS positive FROM post_vote WHERE post_vote.upvote = 1 GROUP BY post_id';
			const subSqlQuery2 =
				'SELECT post_id, count(*) AS total from post_vote GROUP BY post_id';

			sqlQuery = `
        SELECT posts.*, u.positive, (t.total - u.positive) AS negative,  ((u.positive + 1.9208) / (t.total ) - 1.96 * SQRT((u.positive * (t.total - u.positive)) / (t.total) + 0.9604) /(t.total ) / (1 + 3.8416 /  (t.total))) AS ci_lower_bound
				FROM posts
				INNER JOIN (${subSqlQuery1}) u ON u.post_id = posts.post_id
				INNER JOIN (${subSqlQuery2}) t ON t.post_id = posts.post_id
			  WHERE  (u.positive + (t.total - u.positive) > 0)
				ORDER BY ci_lower_bound DESC, publication_date DESC;`;
			break;
	}

	try {
		const [rows, fields] = await db.execute(sqlQuery);

		if (rows.length === 0) {
			return cb(null, { posts: [] });
		} else {
			//Renaming fields for easier front-end use
			const posts = rows.map((row) => {
				return {
					postID: row.post_id,
					parentID: row.post_parent_id,
					username: row.username,
					title: row.title,
					content: row.content,
					publicationDate: row.publication_date,
					publicationHour: row.publication_hour,
				};
			});

			return cb(null, posts);
		}
	} catch (error) {
		return cb(error);
	}
};

exports.findOne = async ({ postID }, cb) => {
	try {
		const [
			rows,
			fields,
		] = await db.execute('SELECT * FROM posts WHERE posts.post_id = ?', [
			postID,
		]);

		if (rows.length === 0) {
			return cb(null, false);
		} else {
			//Renaming fields for easier front-end use
			const post = rows.map((row) => {
				return {
					postID: row.post_id,
					parentID: row.post_parent_id,
					username: row.username,
					title: row.title,
					content: row.content,
					publicationDate: row.publication_date,
					publicationHour: row.publication_hour,
				};
			});

			return cb(null, posts);
		}
	} catch (error) {
		return cb(error);
	}
};

exports.deleteOne = ({ params }, cb) => {};

exports.getCommentsOfPost = ({ params, query }, cb) => {};
