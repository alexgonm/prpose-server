const database = require('../models/database'),
bcrypt = require('bcrypt')

exports.findByUsername = (username, callback) => {
	process.nextTick(async () => {
		//Query to find the user
		const query =
			'SELECT  user_id, username, email, password FROM users WHERE username = ?';

		//Looking in the databse if the user exists

		try {
			const [rows, fields] = await database.execute(query, [username]);
			console.log('ii');
			//If the user exists we'll return his info
			if (rows.length === 1) {
				console.log('iiii');
				const user = rows.map(user => {
					return {
						id: user.user_id,
						name: user.username,
						email: user.email,
						password: user.password
					};
				});
				return callback(null, user);
			} else {
				return callback(null, null);
			}
		} catch (err) {
			return callback(err);
		}
		// database.execute(query, [username]).then((err, rows) => {
		// 	if (err) {
		// 		return callback(err);
		// 	}
		// 	//If the user exists we'll return his info
		// 	if (rows.length === 1) {
		// 		const user = rows.map(user => {
		// 			return {
		// 				id: user.user_id,
		// 				name: user.username,
		// 				email: user.email,
		// 				password: user.password
		// 			};
		// 		});
		// 		return callback(null, user);
		// 	} else {
		// 		return callback(null, null);
		// 	}
		// });
	});
};

exports.findByEmail = (email, callback) => {
    process.nextTick(()=> {
        const query =
    })
}

exports.registerUser = (user, callback) => {
    const username  = user.username
    const email = user.email
    process.nextTick(()=> {
        const error;
        this.findByUsername(username, (err, user)=>{
            if (err){
                console.err(err)
            }
            if (user){
                error.username = 'taken'
                return callback()
            }
        })
        this.findByEmail(email, (err, user)=> {

        })
    })
}