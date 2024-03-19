export class PasswordsDatabase {
	/** @param {import('$lib/server/database').Database} db */
	constructor(db) {
		this.db = db;
	}

	/** @param {import('$lib/server/types').Password} password */
	async insert(password) {
		return this.db.exec(async (db) => {
			const passwords = db.passwords || [];
			passwords.push(password);
			db.passwords = passwords;
			return password;
		});
	}

	/** @param {string} userId */
	async findByUserId(userId) {
		return this.db.exec(async (db) => {
			const passwords = db.passwords || [];
			return passwords.find((password) => password.userId == userId) || null;
		});
	}
}
