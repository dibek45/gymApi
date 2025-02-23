import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import {CreateUser, UpdateUser } from './dto';
import { PubSub } from 'graphql-subscriptions';
import { Get } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { WebsocketsGateway } from 'src/socket/gateway';
import { UpdateFingerPrintUserByID } from './dto/inputs/update-user.input.dto';

const pubSub = new PubSub();

@Resolver()
export class UserResolver {
    constructor(private readonly _socketService: WebsocketsGateway,
        private readonly _user:UserService,
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


    @Mutation(() => User, { name: "createUser" })

        async createInput(@Args('createUser') createUser: CreateUser) {
            console.log("llega a resolver createUser")
  
            console.log(createUser.gymId)

            return await this._user.create(createUser);
}


    @Mutation( () => User,{name:"updateUserByDS"})
    updateInput(
        @Args('updateUser') UpdateUser:UpdateUser
    ){
        return this._user.update(UpdateUser);
    }

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

    
    @Mutation( () => Boolean,{name:"deleteUser"})
    delete(@Args('id',{ type: ()=>Int}) id:number){
        return this._user.deleteUser(id);
    }


    @Subscription(() => User)
  newUser() {
    return pubSub.asyncIterator('newUser'); // Maneja la suscripción para el evento newUser
  }
}
