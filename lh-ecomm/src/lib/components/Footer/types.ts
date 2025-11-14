export interface FooterSubs {
	title: string;
	menus: Array<{
		title: string;
		url: string;
	}>;
}

export interface FooterData {
	title: string;
	haveSubs: boolean;
	subs: Array<FooterSubs>;
}
