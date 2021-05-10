import { FastifyRequest } from 'fastify';
import {
  Injectable,
  CanActivate,
  Inject,
  ExecutionContext,
} from '@nestjs/common';
import {
  ADMIN_TOKEN_HEADER,
  MERCHANT_TOKEN_HEADER,
  AUTH_MODULE_METADATA,
  CLIENT_TOKEN_HEADER,
} from '@/constant';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnauthorizedException } from '@jiaxinjiang/nest-exception';
import { UtilHelper } from '@/helper/util.helper';

class JwtIllegalRequestException extends UnauthorizedException {
  readonly code: number = 4000003;
  readonly msg: string = '非法请求，请重新登陆';
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: FastifyRequest = context.switchToHttp().getRequest();
    if (context?.['contextType'] === 'graphql') {
      context = GqlExecutionContext.create(context);
      request = context.getArgByIndex(2).req
    }
    const controller = context.getClass();
    let headerKey = this.reflector.get<string>(
      AUTH_MODULE_METADATA,
      controller,
    );
    if (!headerKey) {
      const { headers } = request;
      [
        ADMIN_TOKEN_HEADER,
        MERCHANT_TOKEN_HEADER,
        CLIENT_TOKEN_HEADER,
      ].forEach(key => headers[key] && (headerKey = key));
    }
    await UtilHelper.switchHandler(this, headerKey, () => {
      throw new JwtIllegalRequestException();
    })(request);
    return true;
  }

  @UtilHelper.Case(ADMIN_TOKEN_HEADER)
  async adminJwt(request: FastifyRequest) {
    const authorization = request.headers[ADMIN_TOKEN_HEADER] as string;
    request.identity = authorization;
  }

  @UtilHelper.Case(MERCHANT_TOKEN_HEADER)
  async merchantJwt(request: FastifyRequest) {
    const merchatToken = request.headers[MERCHANT_TOKEN_HEADER] as string;
    request.identity = merchatToken;
  }

  @UtilHelper.Case(CLIENT_TOKEN_HEADER)
  async clientJwt(request: FastifyRequest) {
    const clientToken = request.headers[CLIENT_TOKEN_HEADER] as string;
    request.identity = clientToken;
  }
}
