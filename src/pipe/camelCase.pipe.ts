import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { UtilHelper } from '@/helper/util.helper';

/**
 * @class CamelCasePipe
 * @classdesc 下划线参数格式转驼峰
 */
@Injectable()
export class CamelCasePipe implements PipeTransform<any> {
  async transform(value: any,  { type }: ArgumentMetadata) {
    if (type === 'custom') {
      return value
    }
    try {
      return UtilHelper.snakeToHump(value);
    } catch (err) {
      throw new Error('Params snake to hump error!');
    }
  }
}
