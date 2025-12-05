import { Controller, Get } from '@nestjs/common';

@Controller('notifications')
export class NotificationController {
  @Get('health')
  health(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

