import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
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
    const gqlCtx = GqlExecutionContext.create(context);
    const table = this.reflector.get<string>(
      AUTO_TOUCH_VERSION_KEY,
      context.getHandler()
    );

    const args = gqlCtx.getArgs();
    const input =
      args.updateProduct ||
      args.createProduct ||
      args.updateUser ||
      args.updateCashRegister ||
      args.input || {};

    const gymIdFromArgs = input.gymId;

    return next.handle().pipe(
      tap(async (result) => {
        if (!table) return;

        const gymId = result?.gymId || result?.gym?.id || gymIdFromArgs;

        if (gymId) {
          console.log(`🟢 [AutoTouch] Updating version for '${table}' and gymId=${gymId}`);
          await this.versionTouchService.touch(gymId, table);
        } else {
          console.warn(`⚠️ [AutoTouch] gymId not found for table: ${table}`);
        }
      })
    );
  }
}
