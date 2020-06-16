const express = require('express'),
	session = require('express-session'),
	dotenv = require('dotenv'),
	cors = require('cors'),
	redisStore = require('connect-redis')(session),
	redis = require('redis');

const app = express(),
	redisClient = redis.createClient();

redisClient.on('error', (err) => {
	console.error('Redis error: ', err);
});

dotenv.config({
	path: './.env',
});

const PORT = process.env.PORT || 3000,
	SESS_ID = process.env.SESS_ID,
	SESS_SECRET = process.env.SESS_SECRET,
	SESS_SECURE = process.env.SESS_SECURE,
	REDIS_HOST = process.env.REDIS_HOST || 'localhost',
	REDIS_PORT = process.env.REDIS_PORT || 6379,
	ADDRESS_ORIGIN = process.env.ADDRESS_ORIGIN;

const authRoutes = require('./routes/auth'),
	usersRoutes = require('./routes/users'),
	postsRoutes = require('./routes/posts'),
	themesRoutes = require('./routes/themes'),
	commentsRoutes = require('./routes/users');

app.use('/files', express.static('public'))

	.use(express.urlencoded({ extended: true }))
	.use(express.json())

	.use(
		session({
			name: SESS_ID,
			secret: SESS_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
				maxAge: 600000000,
				secure: SESS_SECURE,
			},
			store: new redisStore({
				host: REDIS_HOST,
				port: REDIS_PORT,
				client: redisClient,
			}),
		})
	)

	.use(
		cors({
			origin: ADDRESS_ORIGIN || 'http://localhost:3000',
			credentials: true,
			methods: ['GET', 'PUT', 'POST', 'DELETE'],
		})
	)

	.use('/auth', authRoutes)
	.use('/users', usersRoutes)
	.use('/themes', themesRoutes)
	//.use('/posts', postsRoutes)
	//.use('/comments', commentsRoutes)

	.listen(PORT, () => console.log(`Backend running on port ${PORT}.`));
