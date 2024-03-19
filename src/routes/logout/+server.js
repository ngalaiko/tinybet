import { redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies, locals }) {
	locals.user = null;
	locals.session = await locals.sessionsDatabase.insert({
		id: randomUUID(),
		userId: null,
		preferences: { displayCurrency: 'SEK' }
	});
	cookies.set('session-id', locals.session.id, {
		maxAge: new Date(2038, 1, 19).getTime() / 1000,
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});
	return redirect(303, '/');
}
