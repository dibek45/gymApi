import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express'; // Importa Response desde Express

import { AppService } from './app.service';
import { Observable, interval, map } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
getHealth() {
  return 'ok';
}

  @Get('huella')
  getSampleData(@Query('estado') estado: number): { name: string } {
    const resValue = estado;
    console.log("El estado es="+estado);
    return { name: `ESTO ES UNA SIMULACION DE LA HUELLA DE C# QUE LLEGA AL SERVER. Valor de res: ${resValue}` };
  }

 
    
  
}
