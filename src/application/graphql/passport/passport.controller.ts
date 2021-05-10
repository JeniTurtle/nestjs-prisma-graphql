import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiErrorResponse } from '@/global/swagger';
import { AdminLoginDTO } from './passport.dto';
import {
  AdminLoginFailedException,
} from './passport.exception';
import { InjectLogger, LoggerProvider } from '@jiaxinjiang/nest-logger';

@ApiTags('管理员后台身份认证相关接口')
@Controller('admin/passport')
export class AdminPassportController {
  constructor(
    @InjectLogger(AdminPassportController)
    private logger: LoggerProvider
  ) {}

  @Post('login')
  @ApiOperation({ summary: '管理员后台登陆接口' })
  @ApiErrorResponse(AdminLoginFailedException)
  async login(@Body() body: AdminLoginDTO) {
    this.logger.info('----------------------------')
    return body;
  }
}