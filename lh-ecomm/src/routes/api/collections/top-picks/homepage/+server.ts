import { json, type RequestHandler } from '@sveltejs/kit';
import { metaObjectQueryByHandle } from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';

export const GET: RequestHandler = async ({ fetch, url }) => {
    const store = url.searchParams.get('store') || 'id';
    const lang = url.searchParams.get('lang') || 'en';

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
                        handle: 'headless-homepage-top-picks',
                        type: 'headless_homepage'
                    }
                }
            })
        });

        const resultMetaTopPicks = await requestMetaTopPicks.json();

        const topPicksId = resultMetaTopPicks.data.metaobject.idData.references.nodes.map(
            (collection: any, index: number) => {
                const jsonId = resultMetaTopPicks.data.metaobject.idNames
                    ? JSON.parse(resultMetaTopPicks.data.metaobject.idNames.value)
                    : [];

                const urlCollection = collection?.category?.value === 'brand' ? `${collection?.parentMenu?.value}/${collection.handle}` : `${collection?.parentMenu?.value}/${collection.handle}`;

                return {
                    title: jsonId[index] ? jsonId[index] : collection.title,
                    handle: `${urlCollection}`.toLowerCase(),
                    expiredSale: collection.saleDate,
                    products: collection.products.edges.map((product: any) => productObjectSchema({
                        product: product.node,
                        store: store,
                        lang: lang,
                        wishlists: wishlists.list,
                    }))
                };
            }
        );

        const topPicksSg = resultMetaTopPicks.data.metaobject.sgData.references.nodes.map(
            (collection: any, index: number) => {
                const jsonSg = resultMetaTopPicks.data.metaobject.sgNames
                    ? JSON.parse(resultMetaTopPicks.data.metaobject.sgNames.value)
                    : [];

                const urlCollection = collection?.category?.value === 'brand' ? `${collection?.parentMenu?.value}/${collection.handle}` : `${collection?.parentMenu?.value}/${collection.handle}`;

                return {
                    title: jsonSg[index] ? jsonSg[index] : collection.title,
                    handle: `${urlCollection}`.toLowerCase(),
                    expiredSale: collection.saleDate,
                    products: collection.products.edges.map((product: any) => productObjectSchema({
                        product: product.node,
                        store: store,
                        lang: lang,
                        wishlists: wishlists.list,
                    }))
                };
            }
        );

        return json({ list: store === 'id' ? topPicksId : topPicksSg });
    } catch (error) {
        return json({ error: 'Internal server error.' }, { status: 500 });
    }
};