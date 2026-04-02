import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

// We use a simple object instead of joi to avoid extra dep — use process.env with defaults
export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env', '.env.local'],
  validate: (config: Record<string, unknown>) => {
    const required = ['DATABASE_URL', 'JWT_SECRET'];
    for (const key of required) {
      if (!config[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
    return config;
  },
});
