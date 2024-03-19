export class BidsDatabase {
	/** @param {import('$lib/server/database').Database} db */
	constructor(db) {
		this.db = db;
	}

	/** @param {import('$lib/server/types').Bid} bid*/
	async insert(bid) {
		return this.db.exec(async (db) => {
			const bids = db.bids || [];
			bids.push(bid);
			db.bids = bids;
			return bid;
		});
	}

	/** @param {string} lotId */
	async listByLotId(lotId) {
		return this.db.exec(async (db) => {
			const bids = db.bids || [];
			return bids.filter((bid) => bid.lotId === lotId);
		});
	}
}

export class BidsController {
	/**
	 * @param {BidsDatabase} db
	 * @param {import('$lib/server/prices').PricesController} pricesController
	 * */
	constructor(db, pricesController) {
		this.db = db;
		this.pricesController = pricesController;
	}

	/**
	 * @param {import('$lib/server/types').Bid | import('$lib/server/types').Bid[]} bids
	 * @param {import('$lib/types').Currency} displayCurrency
	 * */
	async view(bids, displayCurrency) {
		bids = Array.isArray(bids) ? bids : [bids];
		return bids.map((bid) => {
			return {
				...bid,
				value: this.pricesController.convert(bid.value, displayCurrency)
			};
		});
	}

	/**
	 * @param {string} lotId
	 * @param {import('$lib/types').Currency} displayCurrency
	 * */
	async listByLotId(lotId, displayCurrency) {
		const bids = await this.db.listByLotId(lotId);
		return this.view(bids, displayCurrency);
	}

	/**
	 * @param {string} lotId
	 * @param {import('$lib/types').Currency} displayCurrency
	 * */
	async findHighestBidByLotItem(lotId, displayCurrency) {
		const bids = await this.db.listByLotId(lotId);
		const highestBid = bids.reduce((prev, current) =>
			prev.value > current.value ? prev : current
		);
		if (!highestBid) {
			return null;
		}
		return this.view(highestBid, displayCurrency);
	}
}
