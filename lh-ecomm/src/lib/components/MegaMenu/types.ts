export interface MegaMenuSubs {
	title: string;
	url: string;
	haveSubs?: boolean;
	menus?: Array<MegaMenuSubs>;
	sliced?: boolean;
}

export interface MegaMenuData {
	title: string;
	haveSubs: boolean;
	url: string;
	subs: Array<MegaMenuSubs>;
	promotedSection?: PromotedBanner;
}

export interface PromotedBanner {
	banner?: string;
	bannerLink?: string;
}
