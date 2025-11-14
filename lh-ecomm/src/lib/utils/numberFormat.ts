function discountPercentage(maxPrice: string, minPrice: string) {
    return ((Number(maxPrice) - Number(minPrice)) / Number(maxPrice)) * 100;
}

export {
    discountPercentage,
}