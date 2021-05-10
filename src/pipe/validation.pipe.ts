import { ParamValidateException } from '@jiaxinjiang/nest-exception';
import { InjectLogger, LoggerProvider } from '@jiaxinjiang/nest-logger';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CLASS_TYPE_METADATA } from '@nestjs/graphql/dist/graphql.constants'
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { values } from 'lodash';

/**
 * @class ValidationPipe
 * @classdesc 验证所有使用 class-validator 的地方的 class 模型
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(@InjectLogger(ValidationPipe) private logger: LoggerProvider) {}

  private getError(errors: ValidationError[]) {
    let errorMessage: string;
    for (const error of errors) {
      errorMessage = values(error.constraints).reverse()[0];
      return errorMessage ? errorMessage : this.getError(error.children || []);
    }
    return errorMessage;
  }

  async transform(value: any, { type, metatype }: ArgumentMetadata) {
    if (type === 'custom') {
      return value
    }
    // 这里用来过滤用户身份认证信息
    this.logger.log(`Request parameters: ${JSON.stringify(value || {})}`);
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    let object = plainToClass(metatype, value);
    if (!object) {
      object = new metatype();
    }
    const isGraphqlArgs = Reflect.getMetadataKeys(metatype).includes(CLASS_TYPE_METADATA)
    const errors = await validate(object, {
      whitelist: isGraphqlArgs ? false : true,
      forbidUnknownValues: false,
      stopAtFirstError: false,
    });
    if (errors.length) {
      const errorMessage = this.getError(errors);
      throw new ParamValidateException({
        msg: errorMessage,
        error: errorMessage,
      });
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}
