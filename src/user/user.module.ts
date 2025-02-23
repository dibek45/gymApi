import { Module } from '@nestjs/common';


import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from './user.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsocketsGateway } from 'src/socket/gateway';

@Module({
  providers: [UserResolver,UserService,WebsocketsGateway],
 imports:[
  TypeOrmModule.forFeature([User]),

 ]
})
export class UserModule {}
