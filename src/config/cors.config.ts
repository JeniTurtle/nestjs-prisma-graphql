import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import {
  ADMIN_TOKEN_HEADER,
  MERCHANT_TOKEN_HEADER,
  CLIENT_TOKEN_HEADER,
} from '@/constant/header.constant';

export default {
  origin: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD'],
  allowedHeaders: [
    ADMIN_TOKEN_HEADER,
    MERCHANT_TOKEN_HEADER,
    CLIENT_TOKEN_HEADER,
    'Origin',
    'No-Cache',
    'X-Requested-With',
    'If-Modified-Since',
    'Pragma',
    'Last-Modified',
    'Cache-Control',
    'Expires',
    'Content-Type',
    'X-E4M-With',
    'Request-Context-Id',
  ],
} as CorsOptions;
