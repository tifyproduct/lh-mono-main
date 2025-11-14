import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {

  // PROMOTIONS
  const promotions = await fetch('/api/promotions');
  // END PROMOTIONS

  return {
    store: params.store,
    lang: params.lang,
    promotions: await promotions.json(),
  };
};
