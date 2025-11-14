import { json, type RequestHandler } from '@sveltejs/kit';
import { menuNavigationQueryByHandle } from '$lib/graphql.util';


export const GET: RequestHandler = async ({ fetch, url }) => {
    try {
        const requestFooter = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: menuNavigationQueryByHandle().schema,
                variables: {
                    handle: 'lh-footer-headless'
                }
            })
        });
    
        const resultFooter = await requestFooter.json();
    
        const menusFooterFormatted = resultFooter.data.menu.items.map((main: any) => {
            return {
                title: main.title,
                haveSubs: main.items.length > 0,
                subs: main.items.map((subs : any) => {
                    return {
                        title: subs.title,
                        menus: subs.items.map((menu : any) => {
                            return {
                                title: menu.title,
                                url: menu.url.split('/').pop()
                            };
                        })
                    };
                })
            };
        });

        return json({ list: menusFooterFormatted });
    } catch (error) {
        return json({ error: 'Internal server error.' }, { status: 500 });
    }
};