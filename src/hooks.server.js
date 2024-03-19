import { randomUUID } from 'crypto';

import { Database } from '$lib/server/database';
import { UsersDatabase } from '$lib/server/users';
import { SessionsDatabase } from '$lib/server/sessions';
import { PasswordsDatabase } from '$lib/server/passwords';
import { BidsController, BidsDatabase } from '$lib/server/bids';
import { LotsController, LotsDatabase } from '$lib/server/lots';
import { PricesController } from '$lib/server/prices';

const database = new Database();
const usersDatabase = new UsersDatabase(database);
const passwordsDatabase = new PasswordsDatabase(database);
const sessionsDatabase = new SessionsDatabase(database);
const lotsDatabase = new LotsDatabase(database);
const bidsDatabase = new BidsDatabase(database);

const pricesController = new PricesController();
const bidsController = new BidsController(bidsDatabase, pricesController);
const lotsController = new LotsController(lotsDatabase, bidsController, pricesController);

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.usersDatabase = usersDatabase;
	event.locals.passwordsDatabase = passwordsDatabase;
	event.locals.sessionsDatabase = sessionsDatabase;
	event.locals.bidsDatabase = bidsDatabase;
	event.locals.lotsDatabase = lotsDatabase;

	event.locals.bidsController = bidsController;
	event.locals.lotsController = lotsController;
	event.locals.pricesController = pricesController;

	const sessionId = event.cookies.get('session-id');
	if (sessionId) {
		event.locals.session = await sessionsDatabase.findById(sessionId);
	}

	if (event.locals.session == null) {
		event.locals.session = await sessionsDatabase.insert({
			id: randomUUID(),
			userId: null,
			preferences: { displayCurrency: 'SEK' }
		});
		event.cookies.set('session-id', event.locals.session.id, {
			maxAge: new Date(2038, 1, 19).getTime() / 1000,
			path: '/',
			httpOnly: true,
			sameSite: 'lax'
		});
	}

	event.locals.user = await usersDatabase.findById(event.locals.session.userId);

	const response = await resolve(event);
	return response;
}
