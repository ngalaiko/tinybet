import { existsSync, readFileSync, writeFileSync } from 'fs';

import { DB_PATH } from '$env/static/private';

export class Database {
	constructor() {
		if (!existsSync(DB_PATH)) {
			writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
		}
		this.db = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
	}

	/**
        @template R
        @param {(db: import('$lib/server/types').Schema) => Promise<R>} callback
        @returns {Promise<R>}
	*/
	async exec(callback) {
		const result = await callback(this.db);
		writeFileSync(DB_PATH, JSON.stringify(this.db, null, 2));
		return result;
	}
}
