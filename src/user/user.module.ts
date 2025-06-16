import { Module } from '@nestjs/common';


import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './user.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketsGateway } from 'src/socket/gateway';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [UserResolver,UserService,WebsocketsGateway,AppGateway],
 imports:[
  TypeOrmModule.forFeature([User]),

 ],
 exports: [UserService],

})
export class UserModule {}
