import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ params, fetch, url, parent }) => {
  const { customer } = await parent();
  const keyword = url.searchParams.get('keyword');

  try {
    const searchReq = await fetch(`/api/search?store=${params.store}&lang=${params.lang}&customerId=${customer?.id}&keyword=${keyword}`, {
      method: 'GET'
    })

    const seachResult = await searchReq.json();

    return {
      seachResult,
    }
  } catch (error) {
    console.error(error)
  }
};