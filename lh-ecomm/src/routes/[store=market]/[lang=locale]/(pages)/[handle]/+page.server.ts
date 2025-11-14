import type { PageServerLoad } from './$types';
import { collectionQueryByHandle } from '$lib/graphql.util';
import type { ProductsQueryParams } from '$lib/interfaces';
import { productObjectSchema, articleListFilterObjectSchema } from '$lib/utils/createObjectSchema';
import { collectionUrlValidator } from '$lib/utils/validator';
import { seoDefaultGenerate } from '$lib/utils/formatter';
import { exploreAllMapping } from '$lib/utils/megaMenuHelper';

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
	const handle = params.handle;

	const metaQueryCollection = collectionQueryByHandle();
	const { customer } = await parent();

	let wishlistProducts: string[] = [];

	if (customer?.id) {
		const wishlistCustomer = await fetch(
			`/api/customer/wishlist`,
			{
				method: 'GET'
			}
		);

		const wishlists = await wishlistCustomer.json();

		wishlistProducts = wishlists.list;
	}

	const variables: ProductsQueryParams = {
		handle,
		filters: [
			{
				tag: params.store === 'id' ? 'Indonesia' : 'Singapore'
			}
		],
		sortKey: 'CREATED',
		reverse: true,
		first: 30
	};

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQueryCollection.schema,
			variables
		})
	});

	const res = await request.json();

	const faqData = res.data.collection?.faqs?.references?.nodes?.map((faq) => {
		return {
			title: faq.fields[faq.fields.length - 1],
			description: faq.fields[0]
		};
	});

	const link = res.data.collection?.bannerPromotedLink
		? JSON.parse(res.data.collection?.bannerPromotedLink.value)
		: null;

	const products = res.data.collection?.products?.edges.map((product) =>
		productObjectSchema({
			product: product.node,
			store: params.store,
			lang: params.lang,
			wishlists: wishlistProducts
		})
	);

	// Articles
	let articles = [];

	if (res.data.collection?.articleKeyword?.value) {
		const articlesRes = await fetch(`/api/wordpress/posts`, {
			method: 'POST',
			body: JSON.stringify({
				paraphrase: res.data.collection.articleKeyword.value
			})
		});

		if (articlesRes.ok) {
			const articlesData = await articlesRes.json();

			if (articlesData) {
				const formatted = (articlesData ?? []).map((data) =>
					articleListFilterObjectSchema(data, params.lang, params.store)
				);

				articles = formatted.filter((e) => e !== undefined);
			}
		} else {
			console.error('Failed to fetch articles:', articlesRes.status, articlesRes.statusText);
		}
	}

	let topBannerDesktops = [];
	let topBannerMobiles = [];

	let exploreBy = {
		title: null,
		list: []
	};

	if (res.data.collection?.extraInfo?.references?.nodes?.length > 0) {
		const bannerIdx = res.data.collection.extraInfo?.references?.nodes.findIndex(
			(x) => x.type === 'headless_banner'
		);

		const exploreByIdx = res.data.collection.extraInfo?.references?.nodes.findIndex(
			(x) => x.type === 'headless_homepage'
		);

		if (-1 !== bannerIdx) {
			const idxLink = res.data.collection.extraInfo?.references.nodes[bannerIdx].fields.findIndex(
				(x) => x.key === 'banner_link_url'
			);

			let urlLinkList = [];

			if (idxLink != -1) {
				urlLinkList = JSON.parse(
					res.data.collection.extraInfo?.references.nodes[bannerIdx].fields[idxLink]?.value
				);
			}

			for (const index in res.data.collection.extraInfo?.references.nodes[bannerIdx].fields) {
				if (
					res.data.collection.extraInfo?.references.nodes[bannerIdx].fields[index].key ===
					'banner_image'
				) {
					topBannerDesktops = res.data.collection.extraInfo?.references.nodes[bannerIdx].fields[
						index
					]?.references.nodes.map((image, index) => {
						return {
							banner: image.image.url,
							link: idxLink ? urlLinkList[index] : null
						};
					});
				} else if (
					res.data.collection.extraInfo?.references.nodes[bannerIdx].fields[index].key ===
					'banner_mobile'
				) {
					topBannerMobiles = res.data.collection.extraInfo?.references.nodes[bannerIdx].fields[
						index
					]?.references.nodes.map((image, index) => {
						return {
							banner: image.image.url,
							link: idxLink ? urlLinkList[index] : null
						};
					});
				}
			}
		}

		if (-1 !== exploreByIdx) {
			const titleIdx = res.data.collection.extraInfo?.references.nodes[
				exploreByIdx
			].fields.findIndex((x) => x.key === `${params.store}_custom_name`);
			const collectionIdx = res.data.collection.extraInfo?.references.nodes[
				exploreByIdx
			].fields.findIndex((x) => x.key === `${params.store}_stores`);

			const listExplores = res.data.collection.extraInfo?.references?.nodes[exploreByIdx]?.fields[
				collectionIdx
			]?.references.nodes.map((data) => {
				const url = collectionUrlValidator({
					params,
					parentMenu: data.parentMenu?.value,
					category: data.category?.value,
					brandHandle: data.parentCollection?.reference?.handle,
					handle: data.handle
				});

				return {
					title: data.title,
					url: url,
					image: data.image?.url || null
				};
			});

			const titleJson = JSON.parse(
				res.data.collection.extraInfo?.references.nodes[exploreByIdx].fields[titleIdx].value
			);

			exploreBy = {
				title: titleJson[0],
				list: listExplores
			};
		}
	}

	// TopPicks TABS
	const requestMetaTopPicks = await fetch(
		`/api/collections/top-picks/all?lang=${params.lang}&store=${params.store}&handle=${params.handle}&customerId=${customer?.id}`,
		{
			method: 'GET'
		}
	);

	const resultMetaTopPicks = await requestMetaTopPicks.json();

	const subBrands = res.data.collection?.subBrands?.references.nodes.map((data) => {
		return {
			title: data.title,
			handle: data.handle,
			image: data.customBrandImage ? data.customBrandImage : data.image?.url
		};
	});

	let bannerPromoted = {
		banner: res.data.collection?.bannerPromoted?.reference?.image?.url,
		link: link?.url
	};

	if (!bannerPromoted?.banner && (params.handle === 'watch' || params.handle === 'bag')) {
		// Banner Promoted Default
		const defaultBannerReq = await fetch('/api/banner/default', {
			method: 'GET'
		});

		const defaultBannerJson = await defaultBannerReq.json();

		bannerPromoted = defaultBannerJson.data;
	}

	//COMPLETE COLLECTION
	const completeCollectionReq = await fetch(`/api/collections/complete-collection?lang=en&store=id&category=${exploreAllMapping(handle.toUpperCase())?.tag}&limit=10`,
		{
			method: 'GET'
		}
	);

	const completeCollectionRes = {
		handle: exploreAllMapping(handle.toUpperCase()),
		products: await completeCollectionReq.json()
	}

	return {
		type: params.handle,
		breadcrumbs: [
			{
				title: res.data.collection?.title,
				url: res.data.collection?.handle
			}
		],
		subBrands,
		bannerPromoted: bannerPromoted,
		topBanner: {
			desktop: topBannerDesktops,
			mobile: topBannerMobiles
		},
		topPicks: resultMetaTopPicks.list,
		articles,
		products,
		exploreBy,
		faqs: faqData,
		seo: {
			title: params.store === 'sg' ?
				(res.data?.collection?.seoSgTitle?.value || res.data?.collection?.seo?.title || seoDefaultGenerate('title')) :
				(params.lang === 'en' ?
					(res.data?.collection?.seoIdTitle?.value || res.data?.collection?.seo?.title || seoDefaultGenerate('title')) :
					seoDefaultGenerate('title')),
			metaDescription: params.store === 'sg' ?
				(res.data?.collection?.seoSgDescription?.value || res.data?.collection?.seo?.description || seoDefaultGenerate('description')) :
				(params.lang === 'en' ?
					(res.data?.collection?.seoIdDescription?.value || res.data?.collection?.seo?.description || seoDefaultGenerate('description')) :
					seoDefaultGenerate('description'))
		},
		completeCollection: completeCollectionRes,
	};
};
