/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types';

export type ProductQueryQueryVariables = StorefrontTypes.Exact<{
  handle?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['String']['input']>;
}>;


export type ProductQueryQuery = { product?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Product, 'id' | 'title' | 'handle' | 'descriptionHtml' | 'onlineStoreUrl'>
    & { featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'altText' | 'height' | 'id' | 'url' | 'width'>>, seo: Pick<StorefrontTypes.Seo, 'title' | 'description'>, variants: { edges: Array<{ node: { price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }> }, metafield?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Metafield, 'id' | 'value'>> }
  )> };

interface GeneratedQueryTypes {
  "\n\t\t#graphql\n\t\tquery ProductQuery($handle: String) {\n\t\t\tproduct(handle: $handle) {\n\t\t\t\tid\n\t\t\t\ttitle\n\t\t\t\thandle\n\t\t\t\tdescriptionHtml\n\t\t\t\tfeaturedImage {\n\t\t\t\t\taltText\n\t\t\t\t\theight\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t\twidth\n\t\t\t\t}\n\t\t\t\tonlineStoreUrl\n\t\t\t\tseo {\n\t\t\t\t\ttitle\n\t\t\t\t\tdescription\t\n\t\t\t\t}\n\t\t\t\tvariants(first:5) {\n\t\t\t\t\tedges{\n\t\t\t\t\t\tnode{\n\t\t\t\t\t\t\tprice{\n\t\t\t\t\t\t\t\tamount\n\t\t\t\t\t\t\t\tcurrencyCode\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tmetafield(namespace:\"specifications\", key: \"water_resistance\") {\n\t\t\t\t\tid\n\t\t\t\t\tvalue\n\t\t\t\t\t\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": {return: ProductQueryQuery, variables: ProductQueryQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
