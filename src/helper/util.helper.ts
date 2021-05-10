import { Injectable } from '@nestjs/common';
import { isArray, cloneDeep, camelCase,snakeCase } from 'lodash';
import moment from 'moment';

@Injectable()
export class UtilHelper {
  /**
   * 延迟指定毫秒
   * @param delayTime 毫秒
   */
  static async sleep(delayTime = 0) {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), delayTime);
    });
  }
  static deepEach(target: any, callback: (p?: any) => any, depth = 10) {
    if (--depth < 0) {
      return;
    }
    if (isArray(target)) {
      target.forEach(item => UtilHelper.deepEach(item, callback));
    } else {
      callback(target);
      for (const key in target) {
        if (target[key] && typeof target[key] === 'object') {
          UtilHelper.deepEach(target[key], callback, depth - 1);
        }
      }
    }
    return target;
  }

  static snakeToHump<T = any>(target: T, depth = 10) {
    const temp = cloneDeep(target);
    return UtilHelper._snakeToHump<T>(temp, depth);
  }

  private static _snakeToHump<T = any>(target: T, depth = 10) {
    if (--depth < 0) {
      return;
    }
    if (isArray(target)) {
      target.forEach(item => UtilHelper._snakeToHump(item));
    } else {
      for (const key in target) {
        const newKey = camelCase(key);
        if (key !== newKey) {
          target[newKey] = target[key];
          delete target[key];
        }
        if (target[newKey] && typeof target[newKey] === 'object') {
          UtilHelper._snakeToHump(target[newKey], depth - 1);
        }
      }
    }
    return target;
  }

  static humpToSnake<T = any>(target: T, depth = 10) {
    const temp = cloneDeep(target);
    return UtilHelper._humpToSnake<T>(temp, depth);
  }

  private static _humpToSnake<T = any>(target: T, depth = 10) {
    if (--depth < 0) {
      return;
    }
    if (isArray(target)) {
      target.forEach(item => UtilHelper._humpToSnake(item));
    } else {
      for (const key in target) {
        const newKey = snakeCase(key);
        if (key !== newKey) {
          target[newKey] = target[key];
          delete target[key];
        }
        if (target[newKey] && typeof target[newKey] === 'object') {
          UtilHelper._humpToSnake(target[newKey], depth - 1);
        }
      }
    }
    return target;
  }

  /**
   * 驼峰转下划线
   * @param data
   */
  static bufferEncode(data): Buffer {
    if (typeof data === 'object' && data.constructor === Object) {
      return Buffer.from(JSON.stringify(UtilHelper.humpToSnake(data)));
    }
    if (typeof data === 'string') {
      return Buffer.from(data);
    }
    return data;
  }

  /**
   * 下划线转驼峰
   * @param data
   */
  static bufferDecode(data: Buffer): object | string {
    try {
      return UtilHelper.snakeToHump(JSON.parse(data.toString()));
    } catch (err) {}
    return data.toString();
  }

  /**
   * 生成订单号
   */
  static generateOrderNo() {
    const random = parseInt(
      String(Math.random() * (99999 - 10000 + 1) + 10000),
      10,
    );
    const date = moment()
      .locale('zh-cn')
      .format('YYYYMMDDHHmmss');
    return date + random;
  }

  private static switchMetadataKey = 'switch_metadata_case_value'

  static Case(value): MethodDecorator {
    return (target, propertyKey) => {
      const metadataVal = Reflect.getMetadata(UtilHelper.switchMetadataKey, target) || {};
      const values = Object.keys(metadataVal);
      if (values.includes(value)) {
        throw new Error(`Case注解的值(${value})已经存在，请勿重复设置`);
      }
      metadataVal[value] = propertyKey;
      Reflect.defineMetadata(UtilHelper.switchMetadataKey, metadataVal, target);
    };
  }
  
  static switchHandler<R = any>(
    instance,
    value,
    switchDefault = () => {
      return;
    },
  ): R {
    const metadataVal =
      Reflect.getMetadata(UtilHelper.switchMetadataKey, instance.constructor.prototype) ||
      {};
    const propertyKey = metadataVal[value];
    if (!propertyKey || !instance[propertyKey]) {
      return switchDefault.bind(instance);
    }
    return instance[propertyKey].bind(instance);
  }
}
