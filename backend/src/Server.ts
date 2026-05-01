import { Configuration, Inject } from '@tsed/di';
import { PlatformApplication } from '@tsed/common';
import '@tsed/platform-express';
import '@tsed/swagger';
import '@tsed/ajv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ['application/json'],
  httpPort: config.port,
  httpsPort: false,
  disableComponentScan: false,
  mount: {
    '/api/v1': [`${rootDir}/modules/**/*.controller.ts`],
  },
  swagger: [
    {
      path: '/api/docs',
      specVersion: '3.0.1',
      spec: {
        info: {
          title: 'API Documentation',
          version: '1.0.0',
        },
      },
    },
  ],
  ajv: {
    returnsCoercedValues: true,
  },
})
export class Server {
  @Inject()
  protected app!: PlatformApplication;

  $beforeRoutesInit(): void {
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: config.isProduction,
    }));

    // CORS — explicit whitelist only
    this.app.use(cors({
      origin: config.allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }));

    // Global rate limit (per-endpoint limits are set on individual routes)
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
    }));

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }
}
