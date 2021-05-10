import {
  Module,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
  CanActivate,
  ModuleMetadata,
} from '@nestjs/common';
import { ApiHeader, ApiBearerAuth } from '@/global/swagger';
import { JwtGuard } from '@/guard';
import {
  AUTH_MODULE_METADATA,
  AUTHORIZE_METADATA,
} from '@/constant';

export interface AuthModuleMetadata extends ModuleMetadata {
  header?: string;
}

/**
 * 给控制器绑定所属根模块，用来做授权认证区分
 * @param module
 */
export const AuthModule = (
  options: AuthModuleMetadata,
): ClassDecorator => target => {
  const header = options.header || null;
  delete options.header;
  Module(options)(target);
  const bindAuthModule = (modules: any[]) => {
    for (const module of modules) {
      const ctrls = Reflect.getMetadata('controllers', module) || [];
      const providers = Reflect.getMetadata('providers', module) || [];
      const classList = [...ctrls, ...providers];
      if (classList && classList.length) {
        for (const target of classList) {
          const metadata = Reflect.getMetadata(AUTH_MODULE_METADATA, target);
          if (metadata === undefined) {
            Reflect.defineMetadata(AUTH_MODULE_METADATA, header, target);
          }
        }
      }
      const imports = Reflect.getMetadata('imports', module);
      if (imports && imports.length) {
        bindAuthModule(imports);
      }
    }
  };
  const imports = options.imports || [];
  bindAuthModule([...imports, target]);
};

/**
 * 需要认证授权注解
 * @param guards
 */
export const Authorize = (
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    UseGuards(JwtGuard, ...guards)(target, key, descriptor);
    ApiBearerAuth('Token')(target, key, descriptor);
    ApiHeader({
      name: 'Authorization',
      description: '认证签名',
    })(target, key, descriptor);
    if (descriptor) {
      Reflect.defineMetadata(AUTHORIZE_METADATA, true, descriptor.value);
    } else {
      Reflect.defineMetadata(AUTHORIZE_METADATA, true, target);
    }
  };
};

/**
 * 获取身份认证信息注解
 */
export const Identity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.identity;
  },
);
