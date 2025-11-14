import type { PageServerLoad } from './$types';
import { collectionQueryByHandle } from '$lib/graphql.util';
import { getCollectionProductsPagination, getRecentlyViewedFromMongoDB } from '$lib';
import type { ProductsQueryParams } from '$lib/interfaces';
import {
	breadcrumbObjectSchema,
	articleListFilterObjectSchema
} from '$lib/utils/createObjectSchema';
import { seoDefaultGenerate } from '$lib/utils/formatter';
import { encodeFilterParams } from '$lib/utils/modifyUrlString';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getFeatureFlagsServerSide } from '$lib/utils/getFeatureFlagsServerSide';

export const load: PageServerLoad = async ({ params, fetch, locals, url }) => {
	const featureFlags = await getFeatureFlagsServerSide();

	const metaQuery = collectionQueryByHandle();
	const isProduction: boolean = env.VITE_APP_ENV === 'production';

	const filters = [];
	const baseFilter = {
		tag: params.store === 'id' ? 'Indonesia' : 'Singapore'
	};

	filters.push(baseFilter);
	if (isProduction) {
		filters.push({ tag: 'Live' });
	}

	const filterParams = featureFlags.collectionPageV2 ? null : url.searchParams.get('filters');

	const sortKey = featureFlags.collectionPageV2
		? 'CREATED'
		: url.searchParams.get('sortKey') || 'CREATED';

	const reverseParam = url.searchParams.get('reverse');
	const after = url.searchParams.get('after');
	const before = url.searchParams.get('before');
	const productSize = 6 * 3;
	let reverse: boolean;
	if (sortKey === 'CREATED' && !reverseParam) {
		reverse = true;
	} else {
		reverse = reverseParam === 'true';
	}

	if (filterParams && filterParams.length > 0) {
		for (const filterParam of filterParams.split(',')) {
			filters.push(JSON.parse(filterParam));
		}
	}

	const variables: ProductsQueryParams = {
		handle: params.sectionBeauty,
		filters,
		sortKey,
		reverse: reverse,
		first: productSize
	};

	if (after) {
		variables.after = after;
		variables.first = productSize;
	}

	if (before) {
		delete variables.first;
		variables.before = before;
		variables.last = productSize;
	}

	const productPagination = await getCollectionProductsPagination(
		{
			variables: JSON.parse(JSON.stringify(variables)),
			fetch,
			url
		},
		productSize
	);

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables
		})
	});

	const result = await request.json();

	const { collection } = result.data;

	// Redirect to 404 if collection type does not match params type
	if (
		collection?.parentMenu?.value?.toLowerCase() !== params.type &&
		collection?.parentCollection?.reference?.handle !== params.type
	) {
		throw redirect(307, `/${params.store}/${params.lang}/404`);
	}

	const faqData = collection?.faqs?.references?.nodes?.map((faq) => {
		return {
			title: faq.fields[faq.fields.length - 1],
			description: faq.fields[0]
		};
	});

	const link = collection?.bannerPromotedLink
		? JSON.parse(collection?.bannerPromotedLink.value)
		: null;

	// Articles
	let articles = [];

	if (collection?.articleKeyword?.value) {
		const articlesRes = await fetch(`/api/wordpress/posts`, {
			method: 'POST',
			body: JSON.stringify({
				paraphrase: collection.articleKeyword.value
			})
		});

		let articlesData = await articlesRes.json();

		if (articlesData.message === 'Internal Error') {
			articlesData = [];
		}

		const formatted = articlesData.map((data) =>
			articleListFilterObjectSchema(data, params.lang, params.store)
		);

		articles = formatted.filter((e) => e !== undefined);
	}

	let bannerPromoted = {
		banner: collection?.bannerPromoted?.reference?.image?.url,
		link: link?.url
	};

	if (!bannerPromoted?.banner && (params.type == 'watch' || params.type === 'bag')) {
		// Banner Promoted Default
		const defaultBannerReq = await fetch('/api/banner/default', {
			method: 'GET'
		});

		const defaultBannerJson = await defaultBannerReq.json();

		bannerPromoted = defaultBannerJson.data;
	}

	return {
		productPagination,
		recentlyViewed: await getRecentlyViewedFromMongoDB({ params, fetch, locals }),
		type: params.type,
		handle: variables.handle,
		activeFilters: filters.filter((f) => f !== baseFilter),
		filters: collection?.products?.filters,
		brand: {
			image: collection?.image?.url,
			title: collection?.title,
			description: collection?.description,
			descriptionHtml: collection?.descriptionHtml,
			descriptionId: collection.descriptionId?.value,
			descriptionSg: collection.descriptionSg?.value,
		},
		breadcrumbs: breadcrumbObjectSchema({ data: collection, isProduct: false, params: params }),
		bannerPromoted,
		articles,
		encodedVariables: encodeFilterParams(JSON.stringify(variables)),
		faqs: faqData,
		seo: {
			title:
				params.store === 'sg'
					? collection.seoSgTitle
						? collection.seoSgTitle?.value
						: collection.seo.title
					: params.lang === 'en'
						? collection.seoIdTitle
							? collection.seoIdTitle?.value
							: collection.seo.title
								? collection.seo.title
								: seoDefaultGenerate('title')
						: seoDefaultGenerate('title'),
			metaDescription:
				params.store === 'sg'
					? collection.seoSgDescription
						? collection.seoSgDescription?.value
						: collection.seo.description
					: params.lang === 'en'
						? collection.seoIdDescription
							? collection.seoIdDescription?.value
							: collection.seo.description
								? collection.seo.description
								: seoDefaultGenerate('description')
						: seoDefaultGenerate('description')
		}
	};
};
