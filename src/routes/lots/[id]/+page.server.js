import { fail } from '@sveltejs/kit';

import { parseCurrency } from '$lib/server/prices';
import { randomUUID } from 'crypto';
import { compareAsc } from 'date-fns';
import { nextBid } from '$lib/ladder';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	const displayCurrency =
		locals.user?.preferences.displayCurrency || locals.session.preferences.displayCurrency;

	const lot = await locals.lotsController.findById(params.id, displayCurrency);
	if (!lot) {
		return fail(404);
	}

	const bids = await locals.bidsController.listByLotId(lot.id, displayCurrency);

	return {
		lot,
		bids: bids.reverse()
	};
}

const LOT_ID_NOT_FOUND = { error: true, field: 'lot-id', message: 'lot not found' };

const AMOUNT_EMPTY = { error: true, field: 'amount', message: 'amount is empty' };
const AMOUNT_INVALID = { error: true, field: 'amount', message: 'amount is invalid' };
const AMOUNT_TOO_LOW = { error: true, field: 'amount', message: 'amount is too low' };

const CURRENCY_EMPTY = { error: true, field: 'currency', message: 'empty currency' };
const CURRENCY_UNSUPPORTED = { error: true, field: 'currency', message: 'unsupported currency' };

const AUCTION_ENDED = { error: true, field: 'lot-id', message: 'auction has ended' };

/** @type {import('./$types').Actions} */
export const actions = {
	bid: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401);
		}

		const data = await request.formData();

		const lotId = data.get('lot-id')?.toString();
		if (!lotId) {
			return fail(400, LOT_ID_NOT_FOUND);
		}
		const lot = await locals.lotsController.findById(lotId, 'SEK');
		if (!lot) {
			return fail(400, LOT_ID_NOT_FOUND);
		}
		if (compareAsc(new Date(), lot.endTime) === 1) {
			return fail(400, AUCTION_ENDED);
		}

		const amountRaw = data.get('amount')?.toString();
		if (!amountRaw) {
			return fail(400, AMOUNT_EMPTY);
		}

		const amount = parseFloat(amountRaw);
		if (isNaN(amount)) {
			return fail(400, AMOUNT_INVALID);
		}
        if (amount < lot.minimumNextBidPrice.amount) {
			return fail(400, AMOUNT_TOO_LOW);
        }

		const currencyRaw = data.get('currency')?.toString();
		if (!currencyRaw) {
			return fail(400, CURRENCY_EMPTY);
		}
		const currency = parseCurrency(currencyRaw);
		if (!currency) {
			return fail(400, CURRENCY_UNSUPPORTED);
		}
		const convertedValue = locals.pricesController.convert({ amount, currency }, 'SEK');

		const bid = {
			id: randomUUID(),
			userId: locals.user.id,
			lotId,
			value: convertedValue,
			createdAt: new Date()
		};
		await locals.bidsDatabase.insert(bid);

		return { success: true };
	}
};
