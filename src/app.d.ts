// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			session: import('$lib/session').User;
			user: import('$lib/types').User | null;
			preferences: import('$lib/types').Preferences;

			passwordsDatabase: import('$lib/server/passwords').PasswordsDatabase;
			sessionsDatabase: import('$lib/server/sessions').SessionsDatabase;
			sessionsDatabase: import('$lib/server/sessions').SessionsDatabase;
			usersDatabase: import('$lib/server/users').UsersDatabase;
			bidsDatabase: import('$lib/server/bids').LotsDatabase;
			lotsDatabase: import('$lib/server/lots').LotsDatabase;

			bidsController: import('$lib/server/bids').BidsController;
			lotsController: import('$lib/server/lots').LotsController;
			pricesController: import('$lib/server/prices').PricesController;
		}
	}
}

export {};
