import { json, type RequestHandler } from '@sveltejs/kit';
import { promotedSectionObjectSchema } from '$lib/utils/createObjectSchema';
import {
	menuNavigationQueryByHandle,
	metaObjectQueryByHandle,
	recentlyViewedProducts
} from '$lib/graphql.util';
import { collectionUrlValidator } from '$lib/utils/validator';
import { navigationUrlFormatter } from '$lib/utils/formatter';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const store = url.searchParams.get('store') || 'id';
	const lang = url.searchParams.get('lang') || 'en';

	try {
		const requestMetaPromoted = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: metaObjectQueryByHandle().schema,
				variables: {
					handle: {
						handle: 'promoted-navigation',
						type: 'headless_homepage'
					}
				}
			})
		});

		const resultPromoted = await requestMetaPromoted.json();

		// HEADER MEGA MENU
		const requestHeader = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: menuNavigationQueryByHandle().schema,
				variables: {
					handle: `luxehouze-headless-${store}`
				}
			})
		});

		const resultHeader = await requestHeader.json();

		const menusFormatted = resultHeader.data.menu.items.map((main: any) => {
			const promotedIdx = resultPromoted.data.metaobject.idData.references.nodes.findIndex(
				(x: any) =>
					x.title
						.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.includes(
							main.title
								.toLowerCase()
								.normalize('NFD')
								.replace(/[\u0300-\u036f]/g, '')
						)
			);

			let link: any = null;

			if (promotedIdx !== -1) {
				link = resultPromoted.data.metaobject.idData.references.nodes[promotedIdx]?.bannerLink
					? JSON.parse(
							resultPromoted.data.metaobject.idData.references.nodes[promotedIdx].bannerLink.value
						)
					: null;
			}

			const parentCategory = main.title;

			const categoryLink = main.url?.includes('#')
				? null
				: collectionUrlValidator({
						parentMenu:
							main?.resource?.handle === 'hermes'
								? `bag/${main?.resource?.handle}`
								: main?.resource?.handle?.includes('accessories')
									? 'watch'
									: main?.resource?.handle,
						category: '',
						brandHandle: '',
						handle: '',
						params: {
							store,
							lang
						}
					});

			// Layer 1
			return {
				title: parentCategory,
				haveSubs: main.items.length > 0,
				url:
					main.type === 'COLLECTION'
						? main?.resource?.handle?.includes('accessories')
							? `${categoryLink}/category/${main?.resource?.handle}`
							: categoryLink
						: (main?.url ?? ''),
				type: main.type,
				promotedSection:
					promotedIdx !== -1 && link
						? promotedSectionObjectSchema(
								resultPromoted.data.metaobject.idData.references.nodes[promotedIdx],
								link,
								lang,
								store
							)
						: null,
				subs: main.items.map((subs: any) => {
					const subCategory = subs.title;

					const subCategoryLink = subs.url?.includes('#')
						? null
						: navigationUrlFormatter({
								handle: subs?.url.split('/').pop(),
								previousLink: categoryLink,
								categoryParent: ''
							});

					return {
						title: subCategory,
						url: subCategoryLink,
						brandPage: subs.resource?.metafield?.value
							? subs.resource.metafield.value === 'true'
								? true
								: false
							: false,
						menus: subs.items.map((menu: any) => {
							const thirdLayer = menu.title;
							const thirdLayerLink = menu.url?.includes('#')
								? null
								: collectionUrlValidator({
										parentMenu:
											parentCategory.toLowerCase() === 'hermès'.toLowerCase()
												? 'bag'
												: parentCategory.toLowerCase().includes('accessories')
													? 'watch'
													: parentCategory,
										category: menu?.resource?.category?.value,
										brandHandle: menu?.resource?.parentCollection?.reference?.handle,
										handle: menu?.resource?.handle,
										params: {
											store,
											lang
										}
									});
							const child = resultHeader.data.menu.items?.filter(
								(x: any) => x.title === menu.title && parentCategory.toLowerCase() === 'beauty'
							);
							const childIdx = resultHeader.data.menu.items?.findIndex(
								(x: any) => x.title === menu.title && parentCategory.toLowerCase() === 'beauty'
							);

							if (child?.length > 0) {
								resultHeader.data.menu.items?.splice(childIdx, 1);
							}

							return {
								title: thirdLayer,
								url: thirdLayerLink,
								haveSubs: child?.length > 0,
								brandPage: menu.resource?.metafield?.value
									? menu.resource.metafield.value === 'true'
										? true
										: false
									: false,
								menus:
									child.length > 0
										? child[0].items.map((subs: any) => {
												const fourthLayer = subs.title;
												const parentHandle = subs?.resource?.parentCollection?.reference?.handle
												const fourthLayerLink = subs.url?.includes('#')
													? null
													: navigationUrlFormatter({
															handle: subs?.url.split('/').pop(),
															previousLink: categoryLink,
															categoryParent: `category/${parentHandle}`
														});
												return {
													title: fourthLayer,
													url: fourthLayerLink,
													brandPage: subs.resource?.metafield?.value
														? subs.resource.metafield.value === 'true'
															? true
															: false
														: false,
													menus: subs.items.map((menu: any) => {
														const fifthLayer = menu.title;
														const fifthLayerLink = menu.url?.includes('#')
															? null
															: collectionUrlValidator({
																	parentMenu:
																		parentCategory.toLowerCase() === 'hermès'.toLowerCase()
																			? 'bag'
																			: parentCategory,
																	category: `category/${parentHandle}/${fourthLayer.replace(/ /g, '-')}`,
																	brandHandle: '',
																	handle: menu?.resource?.handle,
																	params: {
																		store,
																		lang
																	}
																});
														return {
															title: fifthLayer,
															url: fifthLayerLink,
															brandPage: menu.resource?.metafield?.value
																? menu.resource.metafield.value === 'true'
																	? true
																	: false
																: false
														};
													})
												};
											})
										: []
							};
						})
					};
				})
			};
		});

		return json({ list: menusFormatted.filter((e: any) => e !== null) });
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error.' }, { status: 500 });
	}
};
