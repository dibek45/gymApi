import { SetMetadata } from '@nestjs/common';
import { SaleService } from 'src/point-of-sale/services/sale.service';
import { Routine } from 'src/routines/routines.entity';

export const AUTO_TOUCH_VERSION_KEY = 'autoTouchVersion';

export const AutoTouchVersion = (table: string) =>
  SetMetadata(AUTO_TOUCH_VERSION_KEY, table);
