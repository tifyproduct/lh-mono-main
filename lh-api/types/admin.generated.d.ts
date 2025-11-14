/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type ProductsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type ProductsQuery = { products: { pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'>, edges: Array<(
      Pick<AdminTypes.ProductEdge, 'cursor'>
      & { node: (
        Pick<AdminTypes.Product, 'id' | 'createdAt' | 'description' | 'descriptionHtml' | 'handle' | 'status' | 'tags' | 'title' | 'productType' | 'updatedAt' | 'vendor'>
        & { category?: AdminTypes.Maybe<Pick<AdminTypes.TaxonomyCategory, 'fullName' | 'name'>>, collections: { nodes: Array<Pick<AdminTypes.Collection, 'handle' | 'title'>> }, featuredMedia?: AdminTypes.Maybe<{ preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }> }>, priceRangeV2: { maxVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>, minVariantPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange?: AdminTypes.Maybe<{ maxVariantCompareAtPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>, minVariantCompareAtPrice: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }>, variants: { nodes: Array<Pick<AdminTypes.ProductVariant, 'sku' | 'price' | 'compareAtPrice'>> } }
      ) }
    )> } };

interface GeneratedQueryTypes {
  "#graphql\n      query Products {\n        products(first: 1, sortKey: CREATED_AT) {\n          pageInfo {\n            hasNextPage\n            hasPreviousPage\n            startCursor\n            endCursor\n          }\n          edges {\n            cursor\n            node {\n              id\n              category {\n                fullName\n                name\n              }\n              collections(first: 100) {\n                nodes {\n                  handle\n                  title\n                }\n              }\n              createdAt\n              description\n              descriptionHtml\n              handle\n              featuredMedia {\n                preview {\n                  image {\n                    url(transform: { preferredContentType: JPG, maxWidth: 250, scale: 3 } )\n                  }\n                }\n              }\n              status\n              tags\n              title\n              productType\n              updatedAt\n              priceRangeV2 {\n                maxVariantPrice {\n                  amount\n                  currencyCode\n                }\n                minVariantPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              compareAtPriceRange {\n                maxVariantCompareAtPrice {\n                  amount\n                  currencyCode\n                }\n                minVariantCompareAtPrice {\n                  amount\n                  currencyCode\n                }\n              }\n              variants(first: 100) {\n                nodes {\n                  sku\n                  price\n                  compareAtPrice\n                }\n              }\n              vendor\n            }\n          }\n        }\n      }\n      ": {return: ProductsQuery, variables: ProductsQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
