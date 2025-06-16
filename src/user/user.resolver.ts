import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import {CreateUser, UpdateUser } from './dto';
import { PubSub } from 'graphql-subscriptions';
import { Get } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { WebsocketsGateway } from 'src/socket/gateway';
import { UpdateAvailableDaysDto, UpdateFingerPrintUserByID } from './dto/inputs/update-user.input.dto';
import { AppGateway } from 'src/app.gateway';
import { AutoTouchVersion } from 'src/update-version/decorators/auto-touch-version.decorator';

const pubSub = new PubSub();

@Resolver()
export class UserResolver {
    constructor(private readonly _socketService: WebsocketsGateway,
        private readonly _user:UserService,
          private readonly gateway: AppGateway // ✅ inyección del WebSocket gateway

      )
    {

    }

    @Query(() => [User], { name: 'usersByGymId' })
    async findAll(
        @Args('gymId', { type: () => Number }) gymId: number,
        @Args('userId', { nullable: true }) userId?: number

    ) {
        
        return this._user.findAllByGymId(gymId,userId); // Aquí asumes que tienes un método que filtra por gymId
    }

    @Query(() => User, { name: 'userTOCheck_gymId_userId' })
    async findUserByGymIdAndUserId(
        @Args('gymId', { type: () => Number }) gymId: number,
        @Args('userId', { nullable: true }) userId: number
    ) {
        console.log(gymId)
        console.log(userId)

        return this._user.findOneByGymAndUserId(gymId,userId); // Aquí asumes que tienes un método que filtra por gymId
    }
    

 @Query(() => User, { name: 'user' })
async findOne(@Args('id', { type: () => Int }) id: number) {
        console.log("entra a el resolver")
        const foundUser = await this._user.findOne(id);
        console.log(foundUser)

        return foundUser;
    }

@Query(() => User, { name: 'userByHuella' })
async findByHuella(@Args('huella', { type: () => String }) huella: string) {
        console.log("LLEGA A RESOLVER")

        const foundUser = await this._user.findByHuella(huella);
        console.log("es la huella"+ "    "+huella);
        this._socketService.server.emit('message', { res: foundUser });
        console.log("traer  user")

        console.log(foundUser)
        return foundUser;
    }

@AutoTouchVersion('members') // ✅
@Mutation(() => User, { name: "createUser" })
async createInput(@Args('createUser') createUser: CreateUser) {
  console.log("📥 Resolver: createUser", createUser.gymId);

  const newUser = await this._user.create(createUser);

  // 🛰 Emitir evento por WebSocket
  this.gateway.server.to(`gym-${newUser.gymId}`).emit('memberUpdated', {
    ...newUser,
    gymId: newUser.gymId,
  });

  return newUser;
}


@AutoTouchVersion('members') // ✅
@Mutation(() => User, { name: "updateUserByDS" })
async updateInput(@Args('updateUser') updateUser: UpdateUser) {
  const updated = await this._user.update(updateUser);

  this.gateway.server.to(`gym-${updated.gymId}`).emit('memberUpdated', {
    ...updated,
    gymId: updated.gymId,
  });

  return updated;
}

@AutoTouchVersion('members') // ✅
@Mutation( () => User,{name:"updateFingerPrintUserByID"})
  updateID(
        @Args('updateFingerPrintUserByID') updateFingerPrintUserByID:UpdateFingerPrintUserByID
    ){
        console.log("llega al servicio update fingerPrint")

        return this._user.updateFingerPrint(updateFingerPrintUserByID);
    }



@Mutation( () => User,{name:"getSatusUser"})
    getSatus(@Args('id',{ type: ()=>Int}) id:number){
        return this._user.getStatus(id);
}

@AutoTouchVersion('members') // ✅
@Mutation(() => Boolean, { name: "deleteUser" })
async delete(@Args('id', { type: () => Int }) id: number) {
  const user = await this._user.findOne(id); // ⬅️ Obtener user para saber su gymId
  const deleted = await this._user.deleteUser(id);

  if (user?.gymId) {
    this.gateway.server.to(`gym-${user.gymId}`).emit('memberDeleted', { id });
  }

  return deleted;
}



@Subscription(() => User)
newUser() {
    return pubSub.asyncIterator('newUser'); // Maneja la suscripción para el evento newUser
}


@AutoTouchVersion('members') // ✅
@Mutation(() => User, { name: 'updateAvailableDays' })
async updateAvailableDays(
  @Args('updateAvailableDaysInput') updateAvailableDaysInput: UpdateAvailableDaysDto,
) {
  const updatedUser = await this._user.updateAvailableDays(updateAvailableDaysInput);

  if (updatedUser?.gymId) {
    this.gateway.server.to(`gym-${updatedUser.gymId}`).emit('memberUpdated', {
      ...updatedUser,
      gymId: updatedUser.gymId,
    });
  }

  return updatedUser;
}

  
}
