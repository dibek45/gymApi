import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { SocketModule } from './socket/gateway.module';
import { WebsocketsGateway } from './socket/gateway';
import { ProductModule } from './product/product.module';
import { GymModule } from './gym/gym.module';
import { CashiersModule } from './point-of-sale/cashiers/cashiers.module';
import { PointOfSaleModule } from './point-of-sale/point-of-sale.module';
import { CategoryModule } from './category/category.module';
//import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
import { MulterModule } from '@nestjs/platform-express';
import { QRCodeModule } from './qr-code/qr-code.module';
import { PromotionModule } from './promotions/promotion.module';
import { RoutineModule } from './routines/routines.module';
import { RolesModule } from './rol/rol.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MachineModule } from './machine/machine.module';

@Module({
  imports: 
          [     
         
            AuthModule,
            MulterModule.register({
              storage: 'memory', 
            }),

            CategoryModule,
            PlanModule,
            UserModule,
            QRCodeModule,
            ProductModule,
            GraphQLModule.forRoot<ApolloDriverConfig>({
              driver: ApolloDriver,
              playground: false,
              autoSchemaFile: true, // Automatically generates
              subscriptions: {
                'subscriptions-transport-ws': true,
              },
              
              plugins: [ApolloServerPluginLandingPageLocalDefault()],
            }),
          
            TypeOrmModule.forRoot({
              type: 'postgres', 
              host: 'db',
              port: 5432,
              username: 'postgres',
              password: 'postgres',
              database: 'postgres',
              entities: ['dist/**/*.entity.{ts,js}'],
              synchronize: false, 
              migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
              autoLoadEntities: true,
            }),
            SocketModule,
            GymModule,
            CashiersModule,
            PointOfSaleModule,
            PromotionModule,
            RoutineModule,
            RolesModule,
            MachineModule 
            
          ],
  controllers: [AppController],
  providers: [AppService,WebsocketsGateway
    //, {
    //provide: 'Upload',
    //useValue: GraphQLUpload, // Registra el scalar Upload
 // },
],
}
)
export class AppModule {}
