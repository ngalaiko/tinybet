import type { Currency, Price, Bid, Lot as DbLot, User, Session } from '$lib/server/types';

export type Lot = DbLot & {
	highestBid: Bid | null;
};

export { Currency, Price, User, Bid, Session };
