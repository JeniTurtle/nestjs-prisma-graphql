import { FastifyLoggerInstance } from 'fastify/types/logger';
import { RouteGenericInterface } from 'fastify/types/route';
import {
  RawServerBase,
  RawServerDefault,
  RawRequestDefaultExpression,
} from 'fastify/types/utils';

declare module 'fastify' {
  interface FastifyRequest<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<
      RawServer
    > = RawRequestDefaultExpression<RawServer>
  > {
    id: any;
    params: RouteGeneric['Params'];
    raw: RawRequest;
    query: RouteGeneric['Querystring'];
    log: FastifyLoggerInstance;
    body: RouteGeneric['Body'];
    validationError?: Error & { validation: any; validationContext: string };
    readonly req: RawRequest;
    readonly headers: RawRequest['headers'] & RouteGeneric['Headers'];
    readonly ip: string;
    readonly ips?: string[];
    readonly hostname: string;
    readonly url: string;
    readonly protocol: 'http' | 'https';
    readonly method: string;
    readonly routerPath: string;
    readonly routerMethod: string;
    readonly is404: boolean;
    readonly socket: RawRequest['socket'];
    readonly connection: RawRequest['socket'];
    identity: any;
  }
}