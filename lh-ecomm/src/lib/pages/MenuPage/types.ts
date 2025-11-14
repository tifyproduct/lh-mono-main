export interface MenuSubs {
	title: string;
	url: string;
	haveSubs?: boolean;
	menus?: Array<MenuSubs>;
}

export interface MenuPageData {
	title: string;
	haveSubs: boolean;
	subs: Array<MenuSubs>;
	url: string;
	type: string;
	promotedSection?: PromotedBanner;
}

export interface PromotedBanner {
	banner?: string;
	bannerLink?: string;
}
