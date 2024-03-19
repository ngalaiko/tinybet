/**
  @param {string} value
  @returns {import('$lib/types').Currency | null}
*/
export function parseCurrency(value) {
	if (value == 'SEK') return 'SEK';
	if (value == 'EUR') return 'EUR';
	if (value == 'GBP') return 'GBP';
	return null;
}

export class PricesController {
	constructor() {
		this.rates = new Map();

		this.storeRate('SEK', 'EUR', 0.01);
		this.storeRate('SEK', 'GBP', 0.02);
	}

	/**
        @param {import('$lib/types').Currency} from
        @param {import('$lib/types').Currency} to
        @param {number} rate
    */
	storeRate(from, to, rate) {
		this.rates.set(`${from}-${to}`, rate);
		this.rates.set(`${to}-${from}`, 1 / rate);
		this.rates.set(`${to}-${to}`, 1);
		this.rates.set(`${from}-${from}`, 1);
	}

	/**
        @param {import('$lib/types').Price} price
        @param {import('$lib/types').Currency} to
    */
	convert(price, to) {
		const rate = this.rates.get(`${price.currency}-${to}`);
		if (rate === undefined) {
			throw new Error(`Unsupported conversion from ${price.currency} to ${to}`);
		}
		return { amount: price.amount * rate, currency: to };
	}
}
