import {
  OpenAPIObject,
  SchemaObject,
  OperationObject,
  ParameterObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { snakeCase } from 'lodash';


export class SwaggerUtils {
  static humpToSnake(document: OpenAPIObject) {
    for (const index in document.components.schemas) {
      const schema = document.components.schemas[index] as SchemaObject;
      if (!schema.properties) {
        continue;
      }
      const { properties, required } = schema;
      for (const property in properties) {
        const snakeKey = snakeCase(property);
        properties[snakeKey] = properties[property];
        snakeKey !== property && delete properties[property];
      }
      for (const key in required) {
        required[key] = snakeCase(required[key]);
      }
    }
    const methods = [
      'get',
      'put',
      'post',
      'delete',
      'options',
      'head',
      'patch',
      'trace',
    ];
    for (const url in document.paths) {
      methods.forEach(method => {
        const obj: OperationObject = document.paths[url][method];
        if (!obj) {
          return;
        }
        const parameters = obj.parameters as ParameterObject[];
        for (const key in parameters) {
          const name = parameters[key].name;
          if (name) {
            parameters[key].name = snakeCase(name);
          }
        }
      });
    }
    return document;
  }
}
