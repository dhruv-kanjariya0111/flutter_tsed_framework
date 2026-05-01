import { Middleware, Req } from '@tsed/common';
import { Unauthorized } from '@tsed/exceptions';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

@Middleware()
export class JwtMiddleware {
  use(@Req() req: Req): void {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Unauthorized('Missing or invalid Authorization header');
    }
    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = payload;
    } catch {
      throw new Unauthorized('Invalid or expired token');
    }
  }
}
