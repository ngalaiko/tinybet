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
	 * @param {import('$lib/server/types').Bid | null} highestBid
	 * @param {import('$lib/types').Currency} displayCurrency
	 * @return {Promise<import('$lib/types').Price>}
     * */
    async calculateMinimumBid(lot, highestBid, displayCurrency) {
        let basePrice = lot.startingPrice
        if (highestBid) {
            basePrice = highestBid.value
        }

        const basePriceInSEK = this.pricesController.convert(basePrice, 'SEK')

        const buckets = [
           [999, 50],
           [4999, 200],
           [9999, 500],
           [19999, 1000],
           [49999, 2000],
           [199999, 5000],
           [499999, 10000],
           [999999, 20000],
           [Infinity, 50000],
        ]


        let minimumBid = basePriceInSEK
        for (const [limit, step] of buckets) {
            if (basePriceInSEK.amount <= limit) {
                minimumBid = {
                    amount: basePriceInSEK.amount + step,
                    currency: basePriceInSEK.currency
                }
                break
            }
        }

        return this.pricesController.convert(minimumBid, displayCurrency)
    }

	/**
	 * @param {import('$lib/server/types').Lot} lot
	 * @param {import('$lib/types').Currency} displayCurrency
	 * @return {Promise<import('$lib/types').Lot>}
	 * */
	async viewOne(lot, displayCurrency) {
		const bids = await this.bidsController.listByLotId(lot.id, displayCurrency);
		const highestBid = bids.sort((a, b) => a.value.amount - b.value.amount).pop() ?? null;
		return {
			...lot,
			startingPrice: this.pricesController.convert(lot.startingPrice, displayCurrency),
            minimumNextBidPrice: await this.calculateMinimumBid(lot, highestBid, displayCurrency),
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
