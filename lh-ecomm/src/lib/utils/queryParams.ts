import type { NavigationTarget } from "@sveltejs/kit";

export const queryParamPreserver = ({ from }: { from: NavigationTarget; }): URLSearchParams => {

  const preservedQuery = new URLSearchParams();

  if (from.url.searchParams.get('utm_campaign')) {
    preservedQuery.set('utm_campaign', from.url.searchParams.get('utm_campaign') ?? '')
  }

  if (from.url.searchParams.get('utm_medium')) {
    preservedQuery.set('utm_medium', from.url.searchParams.get('utm_medium') ?? '')
  }

  if (from.url.searchParams.get('utm_source')) {
    preservedQuery.set('utm_source', from.url.searchParams.get('utm_source') ?? '')
  }

  if (from.url.searchParams.get('utm_term')) {
    preservedQuery.set('utm_term', from.url.searchParams.get('utm_term') ?? '')
  }

  if (from.url.searchParams.get('utm_content')) {
    preservedQuery.set('utm_content', from.url.searchParams.get('utm_content') ?? '')
  }

  if (from.url.searchParams.get('referrer')) {
    preservedQuery.set('referrer', from.url.searchParams.get('referrer') ?? '')
  }

  if (from.url.searchParams.get('lead_src')) {
    preservedQuery.set('lead_src', from.url.searchParams.get('lead_src') ?? '')
  }

  if (from.url.searchParams.get('sales_code')) {
    preservedQuery.set('sales_code', from.url.searchParams.get('sales_code') ?? '')
  }

  if (from.url.searchParams.get('platform_src')) {
    preservedQuery.set('platform_src', from.url.searchParams.get('platform_src') ?? '')
  }


  return preservedQuery;
}