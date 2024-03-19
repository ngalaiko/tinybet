export class SessionsDatabase {
	/** @param {import('$lib/server/database').Database} db */
	constructor(db) {
		this.db = db;
	}

	/** @param {import('$lib/server/types').Session} session */
	async insert(session) {
		return this.db.exec(async (db) => {
			const sessions = db.sessions || [];
			sessions.push(session);
			db.sessions = sessions;
			return session;
		});
	}

	/** @param {import('$lib/server/types').Session} session */
	async update(session) {
		return this.db.exec(async (db) => {
			const sessions = db.sessions || [];
			const index = sessions.findIndex((s) => s.id == session.id);
			if (index == -1) {
				throw new Error('Session not found');
			}
			sessions[index] = session;
			db.sessions = sessions;
			return session;
		});
	}

	/** @param {string} id */
	async findById(id) {
		return this.db.exec(async (db) => {
			const sessions = db.sessions || [];
			return sessions.find((session) => session.id == id);
		});
	}
}
