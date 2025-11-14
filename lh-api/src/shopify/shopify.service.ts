import { Injectable } from '@nestjs/common';
import {
  AdminApiClient,
  createAdminApiClient,
} from '@shopify/admin-api-client';
import * as config from 'config';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MongoRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';

const shopifyConfig = config.get('shopify');

@Injectable()
export class ShopifyService {
  private shopifyAdminApiClient: AdminApiClient;

  constructor(
    @InjectRepository(Product)
    private productRepository: MongoRepository<Product>,
  ) {
    this.shopifyAdminApiClient = createAdminApiClient({
      storeDomain: shopifyConfig.storeDomain,
      apiVersion: shopifyConfig.apiVersion,
      accessToken: shopifyConfig.adminApiAccessToken,
    });
  }

  async syncProducts() {
    let hasNextPage = true;
    let after = null;

    console.log('Product Sync Starting...');
    const start = performance.now();

    while (hasNextPage) {
      const operation = `
        #graphql
        query Products${after ? '($after: String = "")' : ''} {
          products(first: 250, sortKey: CREATED_AT${after ? ', after: $after' : ''}) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
                id
                category {
                  fullName
                  name
                }
                collections(first: 100) {
                  nodes {
                    handle
                    title
                  }
                }
                createdAt
                description
                descriptionHtml
                handle
                featuredMedia {
                  preview {
                    image {
                      url(transform: { preferredContentType: JPG, maxWidth: 250, scale: 3 } )
                    }
                  }
                }
                status
                tags
                title
                productType
                updatedAt
                priceRangeV2 {
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                compareAtPriceRange {
                  maxVariantCompareAtPrice {
                    amount
                    currencyCode
                  }
                  minVariantCompareAtPrice {
                    amount
                    currencyCode
                  }
                }
                variants(first: 100) {
                  nodes {
                    sku
                    price
                    compareAtPrice
                  }
                }
                vendor
              }
            }
          }
        }
      `;

      const variables = {};

      if (after) {
        variables['after'] = after;
      }

      const response = await this.shopifyAdminApiClient.request(operation, {
        variables,
      });

      const data = response.data;

      for (const edge of data.products.edges) {
        const { node } = edge;

        let product = await this.productRepository.findOne({
          where: { shopifyId: node.id },
        });

        if (product) {
          console.log(`Product id: ${node.id} found with uuid: ${product.id}`);
        }

        if (!product) {
          product = new Product();
          product.id = uuid();
          product.updatedAt = new Date();
        }


        product.shopifyId = node.id;
        product.productType = node.productType;
        product.sku = node.variants.nodes
          .map((variant) => variant.sku)
          .filter(Boolean);
        product.tags = node.tags;
        product.name = node.title;
        product.description = node.description;
        product.descriptionHTML = node.descriptionHtml;
        product.category = node.category?.name;
        product.collections = node.collections.nodes.map(
          (collection) => collection.title,
        );
        product.createdAt = new Date(node.createdAt);
        product.updatedAt = new Date(node.updatedAt);
        product.handle = node.handle;
        product.vendor = node.vendor;
        product.status = node.status;
        product.image = node.featuredMedia?.preview.image.url;
        product.channel = this.getProductChannelFromTags(node.tags);
        product.isTesting = node.title.includes('[TESTING') || node.tags.includes('testing') || node.tags.includes('Testing');

        product.compareAtPriceMax = node.compareAtPriceRange
          ? parseFloat(
              node.compareAtPriceRange?.maxVariantCompareAtPrice.amount,
            )
          : null;
        product.compareAtPriceMin = node.compareAtPriceRange
          ? parseFloat(
              node.compareAtPriceRange?.minVariantCompareAtPrice.amount,
            )
          : null;
        product.priceMax = parseFloat(node.priceRangeV2.maxVariantPrice.amount);
        product.priceMin = parseFloat(node.priceRangeV2.minVariantPrice.amount);

        await this.productRepository.save(product);

        console.log(`product: ${product.shopifyId} is saved successfully.`);
      }

      const { pageInfo } = data.products;

      hasNextPage = pageInfo.hasNextPage;
      after = pageInfo?.endCursor;
    }

    const end = performance.now();

    console.log(
      `Product Sync Completed...Total elapsed time: ${end - start}ms...`,
    );
  }

  getProductChannelFromTags(tags: Array<string>): string {
    if (tags.includes('Singapore') || tags.includes('singapore')) {
      return 'SG';
    }

    if (tags.includes('Indonesia') || tags.includes('indonesia')) {
      return 'ID';
    }
  }
}
