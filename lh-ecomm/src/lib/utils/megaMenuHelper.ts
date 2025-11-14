export const exploreAllMapping = (title: string) => {
  switch (title.toUpperCase()) {
    case 'WATCH':
      return {
        title: 'WATCHES',
        tag: 'Watches',
        brandHandle: 'watch',
        categoryHandle: 'watch/category/all-watches'
      };
    case 'HERMÈS':
      return {
        title: 'HERMÈS',
        tag: 'Hermes',
        brandHandle: 'fashion',
        categoryHandle: 'bag/hermes'
      };
    case 'JEWELRY':
      return {
        title: 'JEWELRIES',
        tag: 'Jewelry',
        brandHandle: 'fashion',
        categoryHandle: 'jewelry/category/all-jewelries'
      };
    case 'BEAUTY':
      return {
        title: 'BEAUTIES',
        tag: 'Beauty',
        brandHandle: 'beauty',
        categoryHandle: 'beauty/category/all-beauties'
      };
  }
};