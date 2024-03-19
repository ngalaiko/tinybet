export class UsersDatabase {
	/** @param {import('$lib/server/database').Database} db */
	constructor(db) {
		this.db = db;
	}

	/** @param {import('$lib/server/types').User} user */
	async insert(user) {
		return this.db.exec(async (db) => {
			const users = db.users || [];
			users.push(user);
			db.users = users;
			return user;
		});
	}

	/** @param {import('$lib/server/types').User} user */
	async update(user) {
		return this.db.exec(async (db) => {
			const users = db.users || [];
			const index = users.findIndex((u) => u.id == user.id);
			if (index == -1) {
				throw new Error('User not found');
			}
			users[index] = user;
			db.users = users;
			return user;
		});
	}

	/** @param {string} id */
	async findById(id) {
		return this.db.exec(async (db) => {
			const users = db.users || [];
			return users.find((user) => user.id == id) || null;
		});
	}

	/** @param {string} username */
	async findByUsername(username) {
		return this.db.exec(async (db) => {
			const users = db.users || [];
			return users.find((user) => user.username == username);
		});
	}
}
