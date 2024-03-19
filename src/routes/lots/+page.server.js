/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	const searchParams = new URLSearchParams(url.search);
	const displayCurrency =
		locals.user?.preferences.displayCurrency || locals.session.preferences.displayCurrency;

	const lots = await locals.lotsController.listAll(displayCurrency, {
		userId: searchParams.get('userid')
	});

	return {
		lots
	};
}
