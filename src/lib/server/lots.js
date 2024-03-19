export class LotsDatabase {
	/** @param {import('$lib/server/database').Database} db */
	constructor(db) {
		this.db = db;
	}

	/** @param {import('$lib/server/types').Lot} lot */
	async insert(lot) {
		return this.db.exec(async (db) => {
			const lots = db.lots || [];
			lots.push(lot);
			db.lots = lots;
			return lot;
		});
	}

	/** @param {string} id */
	async findById(id) {
		return this.db.exec(async (db) => {
			const lots = db.lots || [];
			return lots.find((lot) => lot.id === id) || null;
		});
	}

	async listAll() {
		return this.db.exec(async (db) => {
			const lots = db.lots || [];
			return lots;
		});
	}
}

export class LotsController {
	/**
	 * @param {LotsDatabase} db
	 * @param {import('$lib/server/bids').BidsController} bidsController
	 * @param {import('$lib/server/prices').PricesController} pricesController
	 * */
	constructor(db, bidsController, pricesController) {
		this.db = db;
		this.bidsController = bidsController;
		this.pricesController = pricesController;
	}

	/**
	 * @param {import('$lib/server/types').Lot} lot
	 * @param {import('$lib/types').Currency} displayCurrency
	 * @return {Promise<import('$lib/types').Lot>}
	 * */
	async viewOne(lot, displayCurrency) {
		const bids = await this.bidsController.listByLotId(lot.id, displayCurrency);
		const highestBid = bids.length > 0 ? bids[0] : null;
		return {
			...lot,
			startingPrice: this.pricesController.convert(lot.startingPrice, displayCurrency),
			highestBid
		};
	}

	/**
	 * @param {import('$lib/server/types').Lot[]} lots
	 * @param {import('$lib/types').Currency} displayCurrency
	 * @return {Promise<import('$lib/types').Lot[]>}
	 * */
	async viewMany(lots, displayCurrency) {
		return Promise.all(lots.map((lot) => this.viewOne(lot, displayCurrency)));
	}

	/**
	 * @param {string} id
	 * @param {import('$lib/types').Currency} displayCurrency
	 */
	async findById(id, displayCurrency) {
		const lot = await this.db.findById(id);
		if (!lot) {
			return null;
		}
		return this.viewOne(lot, displayCurrency);
	}

	/**
	 * @param {import('$lib/types').Currency} displayCurrency
	 * @param {{userId: string | null}} filter
	 */
	async listAll(displayCurrency, filter = { userId: null }) {
		let lots = await this.db.listAll();
		if (filter.userId) {
			lots = lots.filter((lot) => lot.userId == filter.userId);
		}
		return this.viewMany(lots, displayCurrency);
	}
}
