import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { name: 'login' })
  async login(@Args('email') email: string, @Args('password') password: string) {
    console.log('📤1.1qqqqqqqqqEnviando solicitud de login a auth-service2 vía Redis...', email+ password );
    
     const response = await this.authService.login(email, password);

  return response;

  }


  @Mutation(() => String, { name: 'loginmember' })
  async loginMember(@Args('email') email: string, @Args('password') password: string) {
    console.log('📤Login de loginMember', email+ password );
    
     const response = await this.authService.loginMember(email, password);

      return response;

  }
}
