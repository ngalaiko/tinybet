import { randomUUID } from 'crypto';
import { fail, redirect } from '@sveltejs/kit';

import { parseCurrency } from '$lib/server/prices';

const TITLE_EMPTY = { error: true, field: 'title', message: 'title is empty' };

const STARTING_PRICE_EMPTY = {
	error: true,
	field: 'starting-price',
	message: 'starting price is empty'
};
const STARTING_PRICE_INVALID = {
	error: true,
	field: 'starting-price',
	message: 'starting price is invalid'
};
const STARTING_PRICE_NEGATIVE = {
	error: true,
	field: 'starting-price',
	message: 'starting price is negative'
};

const CURRENCY_EMPTY = { error: true, field: 'starting-price', message: 'empty currency' };
const CURRENCY_UNSUPPORTED = {
	error: true,
	field: 'starting-price',
	message: 'unsupported currency'
};

const END_TIME_EMPTY = { error: true, field: 'end-time', message: 'empty end time' };
const END_TIME_IN_PAST = { error: true, field: 'end-time', message: 'end time is in the past' };

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return redirect(303, '/login');
		}

		const data = await request.formData();
		const title = data.get('title')?.toString();
		if (!title) {
			return fail(400, TITLE_EMPTY);
		}

		const startingPriceRaw = data.get('starting-price')?.toString();
		if (!startingPriceRaw) {
			return fail(400, STARTING_PRICE_EMPTY);
		}

		const startingPrice = parseFloat(startingPriceRaw);
		if (isNaN(startingPrice)) {
			return fail(400, STARTING_PRICE_INVALID);
		}

		if (startingPrice < 0) {
			return fail(400, STARTING_PRICE_NEGATIVE);
		}

		const currencyRaw = data.get('currency')?.toString();
		if (!currencyRaw) {
			return fail(400, CURRENCY_EMPTY);
		}
		const currency = parseCurrency(currencyRaw);
		if (!currency) {
			return fail(400, CURRENCY_UNSUPPORTED);
		}

		const endTimeRaw = data.get('end-time')?.toString();
		if (!endTimeRaw) {
			return fail(400, END_TIME_EMPTY);
		}
		const endTime = new Date(endTimeRaw);
		if (endTime < new Date()) {
			return fail(400, END_TIME_IN_PAST);
		}

		const convertedPrice = locals.pricesController.convert(
			{
				amount: startingPrice,
				currency
			},
			'SEK'
		);

		const lot = {
			id: randomUUID(),
			userId: locals.user.id,
			title,
			endTime,
			startingPrice: convertedPrice
		};

		await locals.lotsDatabase.insert(lot);

		return redirect(303, `/lots/${lot.id}`);
	}
};
