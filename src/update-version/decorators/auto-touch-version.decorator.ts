import { SetMetadata } from '@nestjs/common';


export const AUTO_TOUCH_VERSION_KEY = 'autoTouchVersion';

export const AutoTouchVersion = (table: string) =>
  SetMetadata(AUTO_TOUCH_VERSION_KEY, table);
