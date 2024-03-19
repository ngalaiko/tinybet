import { parseCurrency } from '$lib/server/prices';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const displayCurrency =
		locals.user?.preferences.displayCurrency || locals.session.preferences.displayCurrency;

	const lots = await locals.lotsController.listAll(displayCurrency);

	return {
		lots
	};
}

const CURRENCY_EMPTY = { error: true, field: 'currency', message: 'currency is empty' };
const CURRENCY_NOT_SUPPORTED = {
	error: true,
	field: 'currency',
	message: 'currency is not supported'
};

/** @type {import('./$types').Actions} */
export const actions = {
	displayCurrency: async ({ request, locals, url }) => {
		const data = await request.formData();

		const currencyRaw = data.get('currency')?.toString();
		if (!currencyRaw) {
			return fail(400, CURRENCY_EMPTY);
		}
		const currency = parseCurrency(currencyRaw);
		if (!currency) {
			return fail(400, CURRENCY_NOT_SUPPORTED);
		}

		locals.session.preferences.displayCurrency = currency;
		if (locals.user) {
			locals.user.preferences.displayCurrency = currency;
			await Promise.all([
				locals.sessionsDatabase.update(locals.session),
				locals.usersDatabase.update(locals.user)
			]);
		} else {
			await locals.sessionsDatabase.update(locals.session);
		}

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			redirect(303, redirectTo);
		}

		return { success: true };
	}
};
