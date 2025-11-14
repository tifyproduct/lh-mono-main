import {
  Column,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('Product')
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryColumn()
  @Index()
  id: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({
    type: 'string',
  })
  @Index()
  shopifyId: string;

  @Column({ type: 'string' })
  name: string;

  @Column({ type: 'string' })
  description: string;

  @Column({ type: 'string' })
  descriptionHTML: string;

  @Column({ type: 'array', default: [] })
  tags: Array<string>;

  @Column({ type: 'array' })
  collections: Array<string>;

  @Column({ type: 'string' })
  productType: string;

  @Column({ type: 'string' })
  vendor: string;

  @Column({ type: 'string' })
  handle: string;

  @Column({ type: 'string' })
  status: string;

  @Column({ type: 'string' })
  category: string;

  @Column({ type: 'array' })
  sku: Array<string>;

  @Column({ type: 'string' })
  image: string;

  @Column({ type: 'number' })
  priceMax: number;

  @Column({ type: 'number' })
  priceMin: number;

  @Column({ type: 'number' })
  compareAtPriceMax: number;

  @Column({ type: 'number' })
  compareAtPriceMin: number;

  @Column({ type: 'string'})
  channel: string;

  @Column({ type: 'boolean'})
  isTesting: boolean;
}
