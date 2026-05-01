import { Middleware, Req, Res, Next } from '@tsed/common';
import rateLimit from 'express-rate-limit';

/// Auth endpoints rate limiter — stricter than global.
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

/// Strict rate limiter for password reset / OTP endpoints.
export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
