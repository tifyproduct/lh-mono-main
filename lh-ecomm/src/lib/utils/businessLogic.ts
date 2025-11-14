export function ymalPriceRange({
    productPrice,
}: {
    productPrice: number,
}) {
    // Nano Tier
    if(productPrice < 20000000){
        return {
            minPrice: 0,
            maxPrice: 20000000
        }
    } 
    // Micro Tier
    else if(productPrice > 19999999 && productPrice < 51000000) {
        return {
            minPrice: 20000000,
            maxPrice: 50999999
        }
    } 
    // Low Tier
    else if(productPrice > 50999999 && productPrice < 200000000) {
        return {
            minPrice: 51000000,
            maxPrice: 199999999
        }
    }
    // Mid Tier
    else if(productPrice > 199999999 && productPrice < 700000000) {
        return {
            minPrice: 200000000,
            maxPrice: 699999999
        }
    } 
    // High Tier
    else if(productPrice > 699999999 && productPrice < 2000000000) {
        return {
            minPrice: 700000000,
            maxPrice: 1999999999
        }
    } 
    // Ultra Tier
    else if(productPrice > 1999999999) {
        return {
            minPrice: 1999999999,
            maxPrice: null
        }
    } 
    // Default
    else {
        const halfPrice = Math.round(productPrice / 2);

        return {
            minPrice: productPrice - halfPrice,
            maxPrice: productPrice + halfPrice
        }
    }
}