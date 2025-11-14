export const productQuery = () => {
	const graphqlQuery = `query getProducts($handle: String!, $filters: [ProductFilter!]) {
        productByHandle(handle: $handle) {
            id
            availableForSale
            title
            vendor
            tags
            handle
            productType
            totalInventory
            publishedAt
            updatedAt
            beautyCategory: metafield(namespace: "specifications", key: "beauty_category") {
                value,
                reference {
                    ... on Collection {
                        id
                        title
                        handle
                        parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                            reference {
                                ... on Collection {
                                    id
                                    title
                                    handle
                                    category: metafield(namespace: "settings", key: "category") {
                                        value
                                    }
                                    parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                        reference {
                                            ... on Collection {
                                                id
                                                title
                                                handle
                                                category: metafield(namespace: "settings", key: "category") {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            shippingDelivery: metafield(namespace: "specifications", key: "delivery_shipment") {
                value
                reference {
                        ... on Metaobject {
                            id
                            type
                                fields {
                                    type
                                    value
                                }
                        }
                }
            }
            variants(first: 10) {
                nodes {
                    id
                    availableForSale
                    title
                    price {
                        amount
                        currencyCode
                    }
                    compareAtPrice {
                        amount
                        currencyCode
                    }
                    quantityAvailable
                    image {
                        altText
                        id
                        height
                        url
                        width
                        src
                    }
                    sku
                    storeAvailability(first: 100) {
                        edges {
                            node {
                                available
                                location {
                                    address {
                                        address1
                                        address2
                                        city
                                        country
                                        countryCode
                                        formatted
                                        province
                                        provinceCode
                                        zip
                                        latitude
                                        longitude
                                    }
                                    name
                                }
                            }
                        }
                        nodes {
                            available
                            location {
                                address {
                                    address1
                                    address2
                                    city
                                    country
                                    countryCode
                                    formatted
                                    province
                                    provinceCode
                                    zip
                                    latitude
                                    longitude
                                }
                                name
                            }
                        }
                    }
                }
            }
            saleExpired: metafield(namespace: "settings", key: "sale_date_time") {
                value
            }
            year: metafield(namespace: "specification", key: "year") {
                value
            }
            completeness: metafield(namespace: "specifications", key: "completeness") {
                value
            }
            condition: metafield(namespace: "specifications", key: "condition") {
                value
            }
            subBrand: metafield(namespace: "settings", key: "sub_brand") {
                value
                reference {
                    ... on Collection {
                        title
                        handle
                        parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                            reference {
                                ... on Collection {
                                    id
                                    title
                                    handle
                                    category: metafield(namespace: "settings", key: "category") {
                                        value
                                    }
                                    parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                        value
                                    }
                                    image {
                                        altText
                                        height
                                        id
                                        url
                                        width
                                    }
                                }
                            }
                        }
                    }
                }
            }
            specificationsWatch: metafields(identifiers: [
                { namespace: "specifications", key: "brands" },
                { namespace: "specification", key: "year" },
                { namespace: "specifications", key: "condition" },
                { namespace: "specifications", key: "gender" },
                { namespace: "specifications", key: "case_size" },
                { namespace: "specifications", key: "case_material" },
                { namespace: "specifications", key: "dial" },
                { namespace: "specifications", key: "dial_numeral" },
                { namespace: "specifications", key: "bezel_material" },
                { namespace: "specifications", key: "bracelet_color" },
                { namespace: "specifications", key: "bracelet_material" },
                { namespace: "specifications", key: "clasp" },
                { namespace: "specifications", key: "movement" },
                { namespace: "specifications", key: "water_resistance" },
              ]) {
                key
                value
            }
            specificationsBag: metafields(identifiers: [
                { namespace: "specifications", key: "brands" },
                { namespace: "specification", key: "year" },
                { namespace: "specifications", key: "condition" },
                { namespace: "specifications", key: "gender" },
                { namespace: "specifications", key: "hermes_color" },
                { namespace: "specifications", key: "hermes_leather" },
                { namespace: "specifications", key: "hermes_hardware" },
              ]) {
                key
                value
            }
            specificationsBeauty: metafields(identifiers: [
                { namespace: "specifications", key: "ingredients_import" },
                { namespace: "specifications", key: "how_to_use_import" },
              ]) {
                key
                value
            }
            specificationsJewelry: metafields(identifiers: [
                { namespace: "specifications", key: "brands" },
                { namespace: "jewelry", key: "materials" },
                { namespace: "jewelry", key: "gemstone" },
                { namespace: "jewelry", key: "pendant_length" },
                { namespace: "jewelry", key: "diamonds" },
                { namespace: "jewelry", key: "size" },
                { namespace: "jewelry", key: "color" },
                { namespace: "jewelry", key: "resizeable" },
                { namespace: "jewelry", key: "chainlength" },
                { namespace: "jewelry", key: "pendantheight" },
                { namespace: "specifications", key: "condition" },
                { namespace: "specifications", key: "gender" },
                { namespace: "specifications", key: "clasp" },
              ]) {
                key
                value
            }
            options {
                id
                name
                optionValues {
                    id
                    name
                    swatch {
                        color
                        image {
                            id
                            mediaContentType
                        }
                    }
                }
            }
            compareAtPriceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            priceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            descriptionHtml
            description
            recommendationProductsCollection: metafield(namespace: "settings", key: "recommendation_collection") {
                value
                references(first: 5) {
                    nodes {
                        ... on Collection {
                            id
                            products(first: 15, filters: $filters) {
                                edges {
                                    node {
                                        id
                                        handle
                                        title
                                        availableForSale
                                        totalInventory
                                        vendor
                                        productType
                                        createdAt
                                        description
                                        descriptionHtml
                                        tags
                                        totalInventory
                                        publishedAt
                                        updatedAt
                                        featuredImage {
                                            altText
                                            id
                                            height
                                            url
                                            width
                                            src
                                        }
                                        compareAtPriceRange {
                                            maxVariantPrice {
                                                amount
                                                currencyCode
                                            }
                                            minVariantPrice {
                                                amount
                                                currencyCode
                                            }
                                        }
                                        priceRange {
                                            maxVariantPrice {
                                                amount
                                                currencyCode
                                            }
                                            minVariantPrice {
                                                amount
                                                currencyCode
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            recommendationProducts: metafield(namespace: "settings", key: "recommendation_products") {
                value
                references(first: 20) {
                    nodes {
                        ... on Product {
                            title
                            availableForSale
                            vendor
                            tags
                            handle
                            productType
                            totalInventory
                            publishedAt
                            updatedAt
                            compareAtPriceRange {
                                maxVariantPrice {
                                    amount
                                    currencyCode
                                }
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            priceRange {
                                maxVariantPrice {
                                    amount
                                    currencyCode
                                }
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            featuredImage {
                                altText
                                id
                                height
                                url
                                width
                                src
                            }
                        }
                    }
                }
            }
            thumbnails: images(first:20) {
                edges {
                  node {
                    id
                    originalSrc
                  }
                }
            }
            featuredImage {
                altText
                id
                height
                url
                width
                src
            }
            productExpire: metafield(namespace: "specifications", key: "product_expired") {
                value
            }
            seoSgTitle: metafield(namespace: "seo", key: "sg_store_en_title") {
                value
            }
            seoSgDesc: metafield(namespace: "seo", key: "sg_store_en_description") {
                value
            }
            seoIdTitle: metafield(namespace: "seo", key: "id_store_en_title") {
                value
            }
            seoIdDesc: metafield(namespace: "seo", key: "id_store_en_description") {
                value
            }
            seo {
                title
                description
            }
            collections(first: 30) {
                nodes {
                    ... on Collection {
                        id
                        handle
                        title
                        category: metafield(namespace: "settings", key: "category") {
                            value
                        }
                    }
                }
            }
        }
    }
`;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const productRecommendationQuery = () => {
	const graphqlQuery = `query productRecommendations($handle: String!) {
        productRecommendations(productHandle: $handle) {
            id
            availableForSale
            title
            vendor
            tags
            handle
            productType
            descriptionHtml
            description
            totalInventory
            publishedAt
            updatedAt
            compareAtPriceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            priceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            featuredImage {
                altText
                id
                height
                url
                width
                src
            }
            variants(first: 10) {
                nodes {
                    id
                    title
                    price {
                        amount
                        currencyCode
                    }
                    compareAtPrice {
                        amount
                        currencyCode
                    }
                    quantityAvailable
                    image {
                        altText
                        id
                        height
                        url
                        width
                        src
                    }
                }
            }
        }
    }
`;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const discountQuerySchema = () => {
	const graphqlQuery = `query getDiscount {
        discounts(limit: 100) {
            code
            type
            title
            value
        }
    }
`;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const getProductsQuery = () => {
	const totalQuery = `query getTotal($first: Int, $query: String, $sortKey: ProductSortKeys = BEST_SELLING, $reverse: Boolean = false, $after: String) {
        products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
            edges {
                cursor
                node {
                    handle
                }
            }
        }
	}`;

	const graphqlQuery = `query getProducts($first: Int, $query: String, $sortKey: ProductSortKeys = BEST_SELLING, $reverse: Boolean = false, $after: String) {
        products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
            edges {
                node {
                    id
                    availableForSale
                    title
                    vendor
                    availableForSale
                    tags
                    handle
                    productType
                    descriptionHtml
                    description
                    totalInventory
                    publishedAt
                    updatedAt
                    compareAtPriceRange {
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    priceRange {
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    featuredImage {
                        altText
                        id
                        height
                        url
                        width
                        src
                    }
                }
            }
        }
    }
`;

	return {
		schema: graphqlQuery,
		totalSchema: totalQuery
	};
};

export const productQuerySpecificField = (handle: string) => {
	const filterOption = `vendor:${handle}`;

	const graphqlQuery = `query getProducts($size: Int, $query: String) {
            products(first: $size, query: $query) {
                edges {
                    node {
                        id
                        availableForSale
                        title
                        vendor
                        tags
                        handle
                        productType
                        descriptionHtml
                        description
                        totalInventory
                        publishedAt
                        updatedAt
                        compareAtPriceRange {
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        priceRange {
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        featuredImage {
                            altText
                            id
                            height
                            url
                            width
                            src
                        }
                    }
                }
            }
        }
    `;

	return {
		schema: graphqlQuery,
		query: filterOption
	};
};

export const collectionQueryByHandle = () => {
	const filterOption = ``;

	const graphqlQuery = `query getCollectionById($handle: String, $first: Int, $last: Int, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys = TITLE, $reverse: Boolean = false, $before: String, $after: String) {
            collection(handle: $handle) {
                id
                title
                onlineStoreUrl
                trackingParameters
                description
                descriptionHtml
                handle
                image {
                    altText
                    height
                    id
                    url
                    width
                }
                descriptionId: metafield(namespace: "specifications", key: "collection_description_id_en") {
                    value
                }
                descriptionSg: metafield(namespace: "specifications", key: "collection_description_sg_en") {
                    value
                }
                faqs: metafield(namespace: "settings", key: "faqs") {
                    value
                    references(first: 5) {
                        nodes {
                            ... on Metaobject {
                                id
                                type
                                fields {
                                    type
                                    value
                                }
                            }
                        }
                    }
                }
                category: metafield(namespace: "settings", key: "category") {
                    value
                }
                parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                    value
                }
                bannerPromoted: metafield(namespace: "settings", key: "promoted_banner") {
                    value
                    reference {
                        ... on MediaImage {
                            id
                            alt
                            image {
                                url
                                altText
                            }
                        }
                    }
                }
                mobileBanner: metafield(namespace: "settings", key: "mobile_banner") {
                    value
                    reference {
                        ... on MediaImage {
                            id
                            alt
                            image {
                                url
                                altText
                            }
                        }
                    }
                }
                bannerPromotedLink: metafield(namespace: "settings", key: "promoted_banner_link") {
                    value
                }
                articleKeyword: metafield(namespace: "settings", key: "paraphrase_keyword_article") {
                    value
                }
                parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                    value
                    reference {
                        ... on Collection {
                            id
                            title
                            handle
                            category: metafield(namespace: "settings", key: "category") {
                                value
                            }
                            parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                value
                            }
                            image {
                                altText
                                height
                                id
                                url
                                width
                            }
                            parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                value
                                reference {
                                    ... on Collection {
                                        id
                                        title
                                        handle
                                        category: metafield(namespace: "settings", key: "category") {
                                            value
                                        }
                                        parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                            value
                                        }
                                        image {
                                            altText
                                            height
                                            id
                                            url
                                            width
                                        }
                                        parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                            value
                                            reference {
                                                ... on Collection {
                                                    id
                                                    title
                                                    handle
                                                    image {
                                                        altText
                                                        height
                                                        id
                                                        url
                                                        width
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                subBrands: metafield(namespace: "settings", key: "collection_sub_brand") {
                    value
                    references(first: 30) {
                        nodes {
                            ... on Collection {
                                id
                                title
                                handle
                                customBrandImage: metafield(namespace: "settings", key: "custom_sub_brand_image") {
                                    value
                                    reference {
                                        ... on MediaImage {
                                            id
                                            alt
                                            image {
                                                url
                                                altText
                                            }
                                        }
                                    }
                                }
                                image {
                                    altText
                                    height
                                    id
                                    url
                                    width
                                }
                            }
                        }
                    }
                }
                extraInfo: metafield(namespace: "settings", key: "extra_information") {
                    value
                    references(first: 5) {
                        nodes {
                            ... on Metaobject {
                                id
                                type
                                fields {
                                    type
                                    value
                                    key
                                    references(first: 25) {
                                        nodes {
                                            ... on Collection {
                                                id
                                                title
                                                handle
                                                parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                                    value
                                                }
                                                category: metafield(namespace: "settings", key: "category") {
                                                    value
                                                }
                                                parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                                    value
                                                    reference {
                                                        ... on Collection {
                                                            id
                                                            title
                                                            handle
                                                            image {
                                                                altText
                                                                height
                                                                id
                                                                url
                                                                width
                                                            }
                                                        }
                                                    }
                                                }
                                                image {
                                                    altText
                                                    height
                                                    id
                                                    url
                                                    width
                                                }
                                            }
                                            ... on MediaImage {
                                                id
                                                alt
                                                image {
                                                    url
                                                    altText
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                products(first: $first, last: $last, filters: $filters, sortKey: $sortKey, reverse: $reverse, before: $before, after: $after) {
                    pageInfo {
                        hasPreviousPage
                        hasNextPage
                        endCursor
                        startCursor
                    }
                    filters {
                        id
                        label
                        presentation
                        type
                        values {
                            count
                            id
                            input
                            label
                        }
                    }
                    edges {
                        node {
                            availableForSale
                            createdAt
                            description
                            descriptionHtml
                            tags
                            totalInventory
                            publishedAt
                            updatedAt
                            featuredImage {
                                altText
                                id
                                height
                                url
                                width
                                src
                            }
                            variants(first: 10) {
                                nodes {
                                    id
                                    title
                                    price {
                                        amount
                                        currencyCode
                                    }
                                    compareAtPrice {
                                        amount
                                        currencyCode
                                    }
                                    quantityAvailable
                                    image {
                                        altText
                                        id
                                        height
                                        url
                                        width
                                        src
                                    }
                                }
                            }
                            compareAtPriceRange {
                                maxVariantPrice {
                                    amount
                                    currencyCode
                                }
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            priceRange {
                                maxVariantPrice {
                                    amount
                                    currencyCode
                                }
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            handle
                            id
                            isGiftCard
                            onlineStoreUrl
                            title
                            trackingParameters
                            vendor
                            productType
                        }
                    }
                }
                seoSgTitle: metafield(namespace: "seo", key: "sg_store_en_title") {
                    value
                }
                seoSgDesc: metafield(namespace: "seo", key: "sg_store_en_description") {
                    value
                }
                seoIdTitle: metafield(namespace: "seo", key: "id_store_en_title") {
                    value
                }
                seoIdDesc: metafield(namespace: "seo", key: "id_store_en_description") {
                    value
                }
                seo {
                    description
                    title
                }
            }
        }
    `;

	return {
		schema: graphqlQuery,
		query: filterOption
	};
};

export const searchPredictQueryByHandle = () => {
	const graphqlQuery = `query suggestions($handle: String!) {
        predictiveSearch(query: $handle) {
          queries {
            text
          }
          products {
            availableForSale
            tags
            createdAt
            description
            descriptionHtml
            totalInventory
            publishedAt
            updatedAt
            featuredImage {
                altText
                id
                height
                width
                src
                url
            }
            variants(first: 10) {
                nodes {
                    id
                    title
                    price {
                        amount
                        currencyCode
                    }
                    compareAtPrice {
                        amount
                        currencyCode
                    }
                    quantityAvailable
                    image {
                        altText
                        id
                        height
                        url
                        width
                        src
                    }
                }
            }
            compareAtPriceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            priceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            handle
            id
            title
            vendor
            productType
          }
          collections {
            id
            title
            handle
            parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                value
            }
            category: metafield(namespace: "settings", key: "category") {
                value
            }
            parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                value
                reference {
                    ... on Collection {
                        id
                        title
                        handle
                        image {
                            altText
                            height
                            id
                            url
                            width
                        }
                    }
                }
            }
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const menuNavigationQueryByHandle = () => {
	const graphqlQuery = `query menus($handle: String!) {
        menu(handle: $handle) {
          handle
          title
          items {
            title
            url
            type
            resource {
                ... on Collection {
                    id
                    title
                    handle
                    metafield(namespace: "settings", key: "brand_page") {
                        value
                    }
                }
            }
            items {
                title
                url
                type
                resource {
                    ... on Collection {
                        id
                        title
                        handle
                        isBrand: metafield(namespace: "settings", key: "brand_page") {
                            value
                        }
                        parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                            value
                        }
                        category: metafield(namespace: "settings", key: "category") {
                            value
                        }
                        parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                            value
                            reference {
                                ... on Collection {
                                    id
                                    title
                                    handle
                                    image {
                                        altText
                                        height
                                        id
                                        url
                                        width
                                    }
                                }
                            }
                        }
                    }
                }
                items {
                    title
                    url
                    type
                    resource {
                        ... on Collection {
                            id
                            title
                            handle
                            isBrand: metafield(namespace: "settings", key: "brand_page") {
                                value
                            }
                            parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                value
                            }
                            category: metafield(namespace: "settings", key: "category") {
                                value
                            }
                            parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                value
                                reference {
                                    ... on Collection {
                                        id
                                        title
                                        handle
                                        image {
                                            altText
                                            height
                                            id
                                            url
                                            width
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const metaObjectQueryByHandle = () => {
	const graphqlQuery = `query metaobject($handle: MetaobjectHandleInput!) {
        metaobject(handle: $handle) {
          handle
          type
          idNames: field(key: "id_custom_name"){
            value
          }
          idData: field(key: "id_stores") {
            value
            references(first: 10) {
                nodes {
                    ... on Collection {
                        id
                        title
                        handle
                        parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                            value
                        }
                        category: metafield(namespace: "settings", key: "category") {
                            value
                        }
                        saleDate: metafield(namespace: "settings", key: "sale_date_time") {
                            value
                            type
                        }
                        parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                            reference {
                                ... on Collection {
                                    id
                                    title
                                    handle
                                    category: metafield(namespace: "settings", key: "category") {
                                        value
                                    }
                                }
                            }
                        }
                        banner: metafield(namespace: "settings", key: "promoted_banner") {
                            value
                            type
                            id
                            reference {
                                ... on MediaImage {
                                    id
                                    alt
                                    image {
                                        url
                                        altText
                                    }
                                }
                            }
                        }
                        bannerLink: metafield(namespace: "settings", key: "promoted_banner_link") {
                            value
                            type
                        }
                        products(first: 15, filters: {tag: "Indonesia"}) {
                            edges {
                                node {
                                    id
                                    availableForSale
                                    handle
                                    isGiftCard
                                    onlineStoreUrl
                                    title
                                    trackingParameters
                                    vendor
                                    productType
                                    availableForSale
                                    createdAt
                                    description
                                    descriptionHtml
                                    tags
                                    totalInventory
                                    publishedAt
                                    updatedAt
                                    featuredImage {
                                        altText
                                        id
                                        height
                                        url
                                        width
                                        src
                                    }
                                    compareAtPriceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    priceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
          }
          sgNames: field(key: "sg_custom_name"){
            value
          }
          sgData: field(key: "sg_stores") {
            value
            references(first: 10) {
                nodes {
                    ... on Collection {
                        id
                        title
                        handle
                        parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                            value
                        }
                        category: metafield(namespace: "settings", key: "category") {
                            value
                        }
                        saleDate: metafield(namespace: "settings", key: "sale_date_time") {
                            value
                            type
                        }
                        products(first: 15, filters: {tag: "Singapore"}) {
                            edges {
                                node {
                                    availableForSale
                                    createdAt
                                    description
                                    descriptionHtml
                                    tags
                                    totalInventory
                                    publishedAt
                                    updatedAt
                                    featuredImage {
                                        altText
                                        id
                                        height
                                        url
                                        width
                                        src
                                    }
                                    compareAtPriceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    priceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    handle
                                    id
                                    isGiftCard
                                    onlineStoreUrl
                                    title
                                    trackingParameters
                                    vendor
                                    productType
                                }
                            }
                        }
                    }
                }
            }
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const metaObjectBannerQueryByHandle = () => {
	const graphqlQuery = `query metaobject($handle: MetaobjectHandleInput!) {
        metaobject(handle: $handle) {
          handle
          type
          bannerData: field(key: "banner_image") {
            value,
            references(first: 10) {
                nodes {
                    ... on MediaImage {
                        id
                        alt
                        image {
                            url
                            altText
                        }
                    }
                }
            }
          }
          bannerMobile: field(key: "banner_mobile") {
            value,
            references(first: 10) {
                nodes {
                    ... on MediaImage {
                        id
                        alt
                        image {
                            url
                            altText
                        }
                    }
                }
            }
          }
          urlData: field(key: "banner_link_url") {
            value
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const registerCustomer = () => {
	const graphqlQuery = `mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
            phone
            acceptsMarketing
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const loginCustomer = () => {
	const graphqlQuery = `mutation customerAccessTokenCreate($email: String!, $password: String!) {
        customerAccessTokenCreate(input: {email: $email, password: $password}) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            message
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const subscribeCustomer = () => {
	const graphqlQuery = `mutation customerEmailMarketingSubscribe($email: String!) {
        customerEmailMarketingSubscribe(email: $email) {
          customer {
            firstName
            lastName
            email
            phone
            acceptsMarketing
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const recentlyViewedProducts = () => {
	const graphqlQuery = `query Products($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          handle
          isGiftCard
          onlineStoreUrl
          tags
          title
          trackingParameters
          vendor
          productType
          availableForSale
          createdAt
          description
          descriptionHtml
          tags
          totalInventory
          publishedAt
          updatedAt
          featuredImage {
              altText
              id
              height
              url
              width
              src
          }
          variants(first: 10) {
            nodes {
                id
                title
                price {
                    amount
                    currencyCode
                }
                compareAtPrice {
                    amount
                    currencyCode
                }
                quantityAvailable
                image {
                    altText
                    id
                    height
                    url
                    width
                    src
                }
            }
        }
          compareAtPriceRange {
              maxVariantPrice {
                  amount
                  currencyCode
              }
              minVariantPrice {
                  amount
                  currencyCode
              }
          }
          priceRange {
              maxVariantPrice {
                  amount
                  currencyCode
              }
              minVariantPrice {
                  amount
                  currencyCode
              }
          }
        }
      }
    }
`;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const metaObjectSearchQueryStatic = () => {
	const graphqlQuery = `query metaobject($handle: MetaobjectHandleInput!) {
        metaobject(handle: $handle) {
          handle
          type
          objectId: field(key: "custom_object") {
            value,
          }
          objectSg: field(key: "custom_object_sg") {
            value,
          }
          productsId: field(key: "top_picks") {
            value,
            references(first: 6) {
                nodes {
                    ... on Product {
                        availableForSale
                        createdAt
                        description
                        descriptionHtml
                        tags
                        totalInventory
                        publishedAt
                        updatedAt
                        featuredImage {
                            altText
                            id
                            height
                            url
                            width
                            src
                        }
                        variants(first: 10) {
                            nodes {
                                id
                                title
                                price {
                                    amount
                                    currencyCode
                                }
                                compareAtPrice {
                                    amount
                                    currencyCode
                                }
                                quantityAvailable
                                image {
                                    altText
                                    id
                                    height
                                    url
                                    width
                                    src
                                }
                            }
                        }
                        compareAtPriceRange {
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        priceRange {
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        handle
                        id
                        isGiftCard
                        onlineStoreUrl
                        title
                        trackingParameters
                        vendor
                        productType
                    }
                }
            }
          }
          productsSg: field(key: "top_picks_sg") {
            value,
            references(first: 6) {
                nodes {
                    ... on Product {
                        availableForSale
                        createdAt
                        description
                        descriptionHtml
                        tags
                        totalInventory
                        publishedAt
                        updatedAt
                        featuredImage {
                            altText
                            id
                            height
                            url
                            width
                            src
                        }
                        compareAtPriceRange {
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        priceRange {
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        variants(first: 10) {
                            nodes {
                                id
                                title
                                price {
                                    amount
                                    currencyCode
                                }
                                compareAtPrice {
                                    amount
                                    currencyCode
                                }
                                quantityAvailable
                                image {
                                    altText
                                    id
                                    height
                                    url
                                    width
                                    src
                                }
                            }
                        }
                        handle
                        id
                        isGiftCard
                        onlineStoreUrl
                        title
                        trackingParameters
                        vendor
                        productType
                    }
                }
            }
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const getTotalProducts = () => {
	const graphqlQuery = `query getTotalProducts($handle: String, $first: Int, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys = TITLE, $reverse: Boolean = false, $after: String) {
		collection(handle: $handle) {
			products(first: $first, filters: $filters, sortKey: $sortKey, reverse: $reverse, after: $after) {
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				edges {
					cursor
					node {
						handle
					}
				}
			}
		}
	}`;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerRecovery = () => {
	const graphqlQuery = `mutation customerRecover($email: String!) {
            customerRecover(email: $email) {
              customerUserErrors {
                code
                message
              }
              userErrors {
                field
                message
              }
            }
          }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerProfile = () => {
	const graphqlQuery = `query customerProfile($token: String!) {
        customer(customerAccessToken: $token) {
            id
            firstName
            lastName
            acceptsMarketing
            email
            phone
        }
    }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerUpdate = () => {
	const graphqlQuery = `mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
        customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
          customerAccessToken {
            accessToken
          }
          customerUserErrors {
            field
            message
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerAddress = () => {
	const graphqlQuery = `query customerProfile($token: String!) {
        customer(customerAccessToken: $token) {
            defaultAddress {
                id
            }
            addresses(first: 5) {
                nodes {
                    id
                    formatted
                    firstName
                    lastName
                    phone
                    address1
                    address2
                    company
                    country
                    countryCode
                    countryCodeV2
                    province
                    provinceCode
                    city
                    zip
                    latitude
                    longitude
                }
            }
        }
    }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerCreateAddress = () => {
	const graphqlQuery = `mutation customerAddressCreate($address: MailingAddressInput!, $token: String!) {
        customerAddressCreate(address: $address, customerAccessToken: $token) {
            customerAddress {
                id
            }
            customerUserErrors {
                code
                message
            }
            userErrors {
                field
                message
            }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerUpdateAddress = () => {
	const graphqlQuery = `mutation customerAddressUpdate($address: MailingAddressInput!, $token: String!, $id: ID!) {
        customerAddressUpdate(address: $address, customerAccessToken: $token, id: $id) {
            customerAddress {
                id
            }
            customerUserErrors {
                code
                message
            }
            userErrors {
                field
                message
            }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerDeleteAddress = () => {
	const graphqlQuery = `mutation customerAddressDelete($id: ID!, $token: String!) {
        customerAddressDelete(id: $id, customerAccessToken: $token) {
          deletedCustomerAddressId
          customerUserErrors {
            code
            message
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerSetDefaultAddress = () => {
	const graphqlQuery = `mutation customerDefaultAddressUpdate($addressId: ID!, $token: String!) {
        customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $token) {
          customer {
            id
          }
          customerUserErrors {
            field
            message
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const customerOrderHistory = () => {
	const graphqlQuery = `query customerProfile($token: String!) {
        customer(customerAccessToken: $token) {
            orders(first: 100, sortKey: PROCESSED_AT, reverse: true) {
                pageInfo {
                    endCursor
                    hasNextPage
                    hasPreviousPage
                    startCursor
                }
                totalCount
                nodes {
                    id
                    lineItems(first: 20) {
                        nodes {
                            currentQuantity
                            discountedTotalPrice {
                                amount
                                currencyCode
                            }
                            originalTotalPrice {
                                amount
                                currencyCode
                            }
                            quantity
                            title
                            variant {
                                availableForSale
                                id
                                image {
                                    altText
                                    id
                                    height
                                    url
                                    width
                                    src
                                }
                                compareAtPrice {
                                    amount
                                    currencyCode
                                }
                                price {
                                    amount
                                    currencyCode
                                }
                                product {
                                    id
                                    handle
                                    vendor
                                    tags
                                }
                                title
                                sku
                                unitPrice {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                    billingAddress {
                        id
                        formatted
                        firstName
                        lastName
                        phone
                        address1
                        address2
                        company
                        country
                        countryCode
                        countryCodeV2
                        province
                        provinceCode
                        city
                        zip
                        latitude
                        longitude
                    }
                    cancelReason
                    canceledAt
                    currentSubtotalPrice {
                        amount
                        currencyCode
                    }
                    currentTotalDuties {
                        amount
                        currencyCode
                    }
                    currentTotalPrice {
                        amount
                        currencyCode
                    }
                    currentTotalShippingPrice {
                        amount
                        currencyCode
                    }
                    currentTotalTax {
                        amount
                        currencyCode
                    }
                    customerLocale
                    customerUrl
                    email
                    financialStatus
                    fulfillmentStatus
                    name
                    orderNumber
                    originalTotalDuties {
                        amount
                        currencyCode
                    }
                    originalTotalPrice {
                        amount
                        currencyCode
                    }
                    phone
                    processedAt
                    shippingAddress {
                        id
                        formatted
                        firstName
                        lastName
                        phone
                        address1
                        address2
                        company
                        country
                        countryCode
                        countryCodeV2
                        province
                        provinceCode
                        city
                        zip
                        latitude
                        longitude
                    }
                    statusUrl
                    subtotalPrice {
                        amount
                        currencyCode
                    }
                    successfulFulfillments(first: 20) {
                        trackingCompany
                        trackingInfo(first: 20) {
                            number
                            url
                        } 
                    }
                    totalPrice {
                        amount
                        currencyCode
                    }
                    totalRefunded {
                        amount
                        currencyCode
                    }
                    totalShippingPrice {
                        amount
                        currencyCode
                    }
                    totalTax {
                        amount
                        currencyCode
                    }
                }
    
            }
        }
    }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const getVariantsByHandleQuery = () => {
	const graphqlQuery = `query getVariantsByHandle($handle: String!) {
        productByHandle(handle: $handle) {
            id
            vendor
            tags
            handle
            productType
            variants(first: 20) {
                nodes {
                    availableForSale
                    id
                    title
                    image {
                        altText
                        id
                        height
                        url
                        width
                        src
                    }
                    price {
                        amount
                        currencyCode
                    }
                    compareAtPrice {
                        amount
                        currencyCode
                    }    
                    currentlyNotInStock
                    quantityAvailable
                    sku
                    weight
                    weightUnit
                }
            }
        }
    }`;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const searchProductHandleQuery = () => {
	const graphqlQuery = `
    query suggestions($query: String!) {
        predictiveSearch(query: $query) {
            products {
                handle
            }
        }
    }`;
	return {
		schema: graphqlQuery,
		query: null
	};
};

export const metaObjectPromotionQueryAll = () => {
	return {
		schema: `query metaobjects {
            metaobjects(first: 100, type: "headless_promotions_page") {
                edges {
                    node {
                        handle
                    }
                }
            }
        }`
	};
};

export const metaObjectPromotionQueryByHandle = () => {
	return {
		schema: `query metaobject($handle: MetaobjectHandleInput!) {
            metaobject(handle: $handle) {
                handle
                type
                title: field(key: "promotion_title") {
                    value
                }
                description: field(key: "short_description"){
                    value
                }
                endtime: field(key: "promotion_end_time") {
                    value
                }
                image: field(key: "promotion_image") {
                    value
                    references(first: 1) {
                        nodes {
                            ... on MediaImage {
                                id
                                alt
                                image {
                                    url
                                    altText
                                }
                            }
                        }
                    }
                }
                freetext: field(key: "free_text") {
                    value
                }
                relatedProducts: field(key: "related_products") {
                    value
                }
                promoCodes: field(key: "promo_codes") {
                    value
                }
                collection: field(key: "collection") {
                    value
                }
                tnc: field(key: "tnc"){
                    value
                }
                additionalText: field(key: "additional_text"){
                    value
                }
            }
        }`
	};
};

export const getPromotionByHandleQuery = `
  query getPromotionByHandle($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      handle
      type
      title: field(key: "id_custom_name") {
        value
      }
      endtime: field(key: "promotion_end_time") {
        value
      }
      image: field(key: "promotion_image") {
        value
        references(first: 1) {
          nodes {
            ... on MediaImage {
              id
              alt
              image {
                url
                altText
              }
            }
          }
        }
      }
      freetext: field(key: "free_text") {
        value
      }
      relatedProducts: field(key: "related_products") {
        value
      }
      promoCodes: field(key: "promo_codes") {
        value
      }
    }
  }
`;

export const metaObjectCollectionQueryByHandle = () => {
	const graphqlQuery = `query metaobject($handle: MetaobjectHandleInput!) {
        metaobject(handle: $handle) {
          handle
          type
          idData: field(key: "collection") {
            value
            references(first: 10) {
                nodes {
                    ... on Collection {
                        id
                        title
                        handle
                        parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                            value
                        }
                        category: metafield(namespace: "settings", key: "category") {
                            value
                        }
                        saleDate: metafield(namespace: "settings", key: "sale_date_time") {
                            value
                            type
                        }
                        parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                            reference {
                                ... on Collection {
                                    id
                                    title
                                    handle
                                    category: metafield(namespace: "settings", key: "category") {
                                        value
                                    }
                                }
                            }
                        }
                        banner: metafield(namespace: "settings", key: "promoted_banner") {
                            value
                            type
                            id
                            reference {
                                ... on MediaImage {
                                    id
                                    alt
                                    image {
                                        url
                                        altText
                                    }
                                }
                            }
                        }
                        bannerLink: metafield(namespace: "settings", key: "promoted_banner_link") {
                            value
                            type
                        }
                        products(first: 15, filters: {tag: "Indonesia"}) {
                            edges {
                                node {
                                    id
                                    availableForSale
                                    handle
                                    isGiftCard
                                    onlineStoreUrl
                                    title
                                    trackingParameters
                                    vendor
                                    productType
                                    availableForSale
                                    createdAt
                                    description
                                    descriptionHtml
                                    tags
                                    totalInventory
                                    publishedAt
                                    updatedAt
                                    featuredImage {
                                        altText
                                        id
                                        height
                                        url
                                        width
                                        src
                                    }
                                    compareAtPriceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    priceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
          }
        }
      }
    `;

	return {
		schema: graphqlQuery,
		query: null
	};
};

export const webhookCollectionQueryByHandle = () => {
	const filterOption = ``;

	const graphqlQuery = `query getCollectionById($handle: String) {
            collection(handle: $handle) {
                id
                title
                onlineStoreUrl
                trackingParameters
                description
                descriptionHtml
                handle
                image {
                    altText
                    height
                    id
                    url
                    width
                }
                faqs: metafield(namespace: "settings", key: "faqs") {
                    value
                    references(first: 5) {
                        nodes {
                            ... on Metaobject {
                                id
                                type
                                fields {
                                    type
                                    value
                                }
                            }
                        }
                    }
                }
                category: metafield(namespace: "settings", key: "category") {
                    value
                }
                parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                    value
                }
                bannerPromoted: metafield(namespace: "settings", key: "promoted_banner") {
                    value
                    reference {
                        ... on MediaImage {
                            id
                            alt
                            image {
                                url
                                altText
                            }
                        }
                    }
                }
                bannerPromotedLink: metafield(namespace: "settings", key: "promoted_banner_link") {
                    value
                }
                articleKeyword: metafield(namespace: "settings", key: "paraphrase_keyword_article") {
                    value
                }
                parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                    value
                    reference {
                        ... on Collection {
                            id
                            title
                            handle
                            category: metafield(namespace: "settings", key: "category") {
                                value
                            }
                            parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                value
                            }
                            image {
                                altText
                                height
                                id
                                url
                                width
                            }
                            parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                value
                                reference {
                                    ... on Collection {
                                        id
                                        title
                                        handle
                                        category: metafield(namespace: "settings", key: "category") {
                                            value
                                        }
                                        parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                            value
                                        }
                                        image {
                                            altText
                                            height
                                            id
                                            url
                                            width
                                        }
                                        parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                            value
                                            reference {
                                                ... on Collection {
                                                    id
                                                    title
                                                    handle
                                                    image {
                                                        altText
                                                        height
                                                        id
                                                        url
                                                        width
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                subBrands: metafield(namespace: "settings", key: "collection_sub_brand") {
                    value
                    references(first: 30) {
                        nodes {
                            ... on Collection {
                                id
                                title
                                handle
                                customBrandImage: metafield(namespace: "settings", key: "custom_sub_brand_image") {
                                    value
                                    reference {
                                        ... on MediaImage {
                                            id
                                            alt
                                            image {
                                                url
                                                altText
                                            }
                                        }
                                    }
                                }
                                image {
                                    altText
                                    height
                                    id
                                    url
                                    width
                                }
                            }
                        }
                    }
                }
                extraInfo: metafield(namespace: "settings", key: "extra_information") {
                    value
                    references(first: 5) {
                        nodes {
                            ... on Metaobject {
                                id
                                type
                                fields {
                                    type
                                    value
                                    key
                                    references(first: 25) {
                                        nodes {
                                            ... on Collection {
                                                id
                                                title
                                                handle
                                                parentMenu: metafield(namespace: "settings", key: "parent_menu") {
                                                    value
                                                }
                                                category: metafield(namespace: "settings", key: "category") {
                                                    value
                                                }
                                                parentCollection: metafield(namespace: "settings", key: "collection_parent") {
                                                    value
                                                    reference {
                                                        ... on Collection {
                                                            id
                                                            title
                                                            handle
                                                            image {
                                                                altText
                                                                height
                                                                id
                                                                url
                                                                width
                                                            }
                                                        }
                                                    }
                                                }
                                                image {
                                                    altText
                                                    height
                                                    id
                                                    url
                                                    width
                                                }
                                            }
                                            ... on MediaImage {
                                                id
                                                alt
                                                image {
                                                    url
                                                    altText
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                seoSgTitle: metafield(namespace: "seo", key: "sg_store_en_title") {
                    value
                }
                seoSgDesc: metafield(namespace: "seo", key: "sg_store_en_description") {
                    value
                }
                seoIdTitle: metafield(namespace: "seo", key: "id_store_en_title") {
                    value
                }
                seoIdDesc: metafield(namespace: "seo", key: "id_store_en_description") {
                    value
                }
                seo {
                    description
                    title
                }
            }
        }
    `;

	return {
		schema: graphqlQuery,
		query: filterOption
	};
};
