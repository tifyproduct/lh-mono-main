import { json, type RequestHandler } from '@sveltejs/kit';
import { metaObjectQueryByHandle } from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';
import { collectionUrlValidator } from '$lib/utils/validator';

export const GET: RequestHandler = async ({ fetch, url }) => {
    const store = url.searchParams.get('store') || 'id';
    const lang = url.searchParams.get('lang') || 'en';
    const handle = url.searchParams.get('handle') || '';

    try {
        const wishlistCustomer = await fetch(`/api/customer/wishlist`, {
            method: 'GET',
        });

        const wishlists = await wishlistCustomer.json();

        const requestMetaTopPicks = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: metaObjectQueryByHandle().schema,
                variables: {
                    handle: {
                        handle: 'headless-all-top-picks',
                        type: 'headless_homepage'
                    }
                }
            })
        });

        const resultMetaTopPicks = await requestMetaTopPicks.json();

        const topPicksId = resultMetaTopPicks.data.metaobject.idData?.references.nodes.map(
            (collection: any, index: number) => {
                const jsonId = resultMetaTopPicks.data.metaobject.idNames ? JSON.parse(resultMetaTopPicks.data.metaobject.idNames.value) : [];

                const pageType = handle;

                if (collection?.parentMenu?.value?.toLowerCase() === pageType) {
                    return {
                        title: jsonId[index] ? jsonId[index] : collection.title,
                        handle: collectionUrlValidator({
                            params: {
                                lang: lang,
                                store: store,
                                handle: handle,
                            },
                            parentMenu: collection?.parentMenu?.value,
                            category: collection?.category?.value,
                            brandHandle: collection?.parentCollection?.reference?.handle,
                            handle: collection?.handle,
                        }),
                        expiredSale: collection.saleDate,
                        products: collection.products.edges.map((product: any) => productObjectSchema({
                            product: product.node,
                            store: store,
                            lang: lang,
                            wishlists: wishlists.list,
                        }))
                    };
                } else {
                    return null
                }
            });

        const topPicksSg = resultMetaTopPicks.data.metaobject.sgData.references.nodes.map(
            (collection: any, index: number) => {
                const jsonSg = resultMetaTopPicks.data.metaobject.sgNames ? JSON.parse(resultMetaTopPicks.data.metaobject.sgNames.value) : [];

                const pageType = handle;

                if (collection?.parentMenu?.value?.toLowerCase() === pageType) {
                    return {
                        title: jsonSg[index] ? jsonSg[index] : collection.title,
                        handle: collectionUrlValidator({
                            params: {
                                lang: lang,
                                store: store,
                                handle: handle,
                            },
                            parentMenu: collection?.parentMenu?.value,
                            category: collection?.category?.value,
                            brandHandle: collection?.parentCollection?.reference?.handle,
                            handle: collection?.handle,
                        }),
                        expiredSale: collection.saleDate,
                        products: collection.products.edges.map((product: any) => productObjectSchema({
                            product: product.node,
                            store: store,
                            lang: lang,
                            wishlists: wishlists.list,
                        }))
                    };
                } else {
                    return null
                }
            });


        const topPicksIdFormatted = topPicksId.filter((e: any) => e !== null);
        const topPicksSgFormatted = topPicksSg.filter((e: any) => e !== null);

        return json({ list: store === 'id' ? topPicksIdFormatted : topPicksSgFormatted });
    } catch (error) {
        return json({ error: 'Internal server error.' }, { status: 500 });
    }
};