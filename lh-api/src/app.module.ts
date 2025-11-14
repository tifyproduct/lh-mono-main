import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopifyModule } from './shopify/shopify.module';
import * as config from 'config';

const dbConfig = config.get('db');

console.log({ dbConfig });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: dbConfig.host,
      autoLoadEntities: true,
      synchronize: dbConfig.synchronize,
    }),
    ShopifyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
