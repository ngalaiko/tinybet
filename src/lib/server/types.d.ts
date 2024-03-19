export type Session = {
	id: string;
	userId: string | null;
	preferences: Preferences;
};

export type Preferences = {
	displayCurrency: Currency;
};

export type User = {
	id: string;
	username: string;
	preferences: Preferences;
};

export type Password = {
	userId: string;
	hash: string;
};

export type Currency = 'SEK' | 'EUR' | 'GBP';

export type Price = {
	amount: number;
	currency: Currency;
};

export type Lot = {
	id: string;
	title: string;
	userId: string;
	startingPrice: Price;
	endTime: Date;
};

export type Bid = {
	id: string;
	lotId: string;
	userId: string;
	value: Price;
	createdAt: Date;
};

export type Schema = {
	bids: Bid[];
	lots: Lot[];
	passwords: Password[];
	sessions: Session[];
	users: User[];
};
