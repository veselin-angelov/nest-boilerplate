import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  index() {
    return { message: 'This is just for testing. Delete this controller!' };
  }
}
