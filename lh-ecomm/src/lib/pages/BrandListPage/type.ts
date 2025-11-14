export type BrandListItem = {
  title: string;
  items: {
    name: string,
    handle: string,
    category: 'beauty' | 'watch' | 'bag' | 'jewelry',
    location: 'id' | 'sg',
    lang: 'en' | 'id',
    level: string
  }[];
}