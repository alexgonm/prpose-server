const express = require('express'),
	session = require('express-session'),
	dotenv = require('dotenv'),
	cors = require('cors'),
	passport = require('passport');

const app = express();

dotenv.config({
	path: './.env'
});

const PORT = process.env.PORT || 8080,
	SESS_ID = process.env.SESS_ID,
	SESS_SECRET = process.env.SESS_SECRET,
	SESS_SECURE = process.env.SESS_SECURE;

const authRoutes = require('./controllers/auth'),
	usersRoutes = require('./controllers/users'),
	postsRoutes = require('./controllers/posts'),
	themesRoutes = require('./controllers/themes'),
	commentsRoutes = require('./controllers/users');

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
				secure: SESS_SECURE
			}
		})
	)

	.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
			methods: ['GET', 'PUT', 'POST', 'DELETE']
		})
	)

	.use(passport.initialize())
	.use(passport.session())

	.use('/auth', authRoutes)
	.use('/users', usersRoutes)
	.use('/themes', themesRoutes)
	.use('/posts', postsRoutes)
	.use('/comments', commentsRoutes)

	.use((req, res) => res.sendStatus(404))

	.listen(PORT, () => console.log(`Backend running on port ${PORT}.`));
