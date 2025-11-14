import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ShopifyController } from './shopify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  providers: [ShopifyService],
  controllers: [ShopifyController],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ShopifyModule {}
