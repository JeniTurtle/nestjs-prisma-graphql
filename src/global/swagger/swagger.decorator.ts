import { BaseExceptionConstructor } from '@jiaxinjiang/nest-exception';
import { SetMetadata } from '@nestjs/common';
import { IsIn, ValidationOptions } from 'class-validator';
import { ApiProperty as Property, ApiPropertyOptions , ApiNoContentResponse } from '@nestjs/swagger';
import { EnumHelper } from '@/helper/enum.helper';
import { HTTP_ERROR_RESPONSE } from './swagger.constant';


export function ApiProperty(
  options: ApiPropertyOptions = {},
): PropertyDecorator {
  if (options.enum) {
    options.enum = EnumHelper.transformEnum(options.enum);
  }
  return Property(options);
}
/**
 * 异常响应装饰器
 * @exports ErrorResponse
 * @example @ErrorResponse(SystemException)
 */
export function ApiErrorResponse(
  exception: BaseExceptionConstructor,
): MethodDecorator {
  return (_, __, descriptor: PropertyDescriptor) => {
    SetMetadata<string, BaseExceptionConstructor>(
      HTTP_ERROR_RESPONSE,
      exception,
    )(descriptor.value);
    const err = new exception();
    ApiNoContentResponse({
      description: err.msg,
      type: exception,
    })(_, __, descriptor);
    return descriptor;
  };
}

export function IsEnum(
  entity: Record<string, any>,
  validationOptions?: ValidationOptions,
) {
  const enumObj = EnumHelper.transformEnum(entity);
  return IsIn(Object.values(enumObj), validationOptions);
}
