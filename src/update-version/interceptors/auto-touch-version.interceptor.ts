import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { GqlExecutionContext } from '@nestjs/graphql';
  import { Reflector } from '@nestjs/core';
  import { Observable, tap } from 'rxjs';
  import { AUTO_TOUCH_VERSION_KEY } from '../decorators/auto-touch-version.decorator';
import { UpdateVersionService } from '../update-version.service';
  
  @Injectable()
  export class AutoTouchVersionGraphQLInterceptor implements NestInterceptor {
    constructor(
      private reflector: Reflector,
      private readonly versionTouchService: UpdateVersionService
    ) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      console.log('🛑 Interceptor ejecutado');

      const gqlCtx = GqlExecutionContext.create(context);
      const table = this.reflector.get<string>(
        AUTO_TOUCH_VERSION_KEY,
        context.getHandler()
      );
  
      return next.handle().pipe(
        tap(async (result) => {
          if (!table) return;
  
          const gymId = result?.gymId || result?.gym?.id;
          if (gymId) {
            await this.versionTouchService.touch(gymId, table);
          }
        })     );
    }
  }
  ``