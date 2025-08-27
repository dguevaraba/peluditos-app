/**
 * Production-safe logger utility
 * Logs only in development mode and provides structured logging
 */

import { Environment } from '../config/environment';

export class Logger {
  static info(message: string, data?: any) {
    if (Environment.DEBUG.SHOW_LOGS) {
      console.log(`ℹ️ ${message}`, data || '');
    }
  }

  static error(message: string, error?: any) {
    if (Environment.DEBUG.SHOW_LOGS) {
      console.error(`❌ ${message}`, error || '');
    }
    // In production, you could send to crash reporting service
    // Example: Sentry.captureException(error);
  }

  static warn(message: string, data?: any) {
    if (Environment.DEBUG.SHOW_LOGS) {
      console.warn(`⚠️ ${message}`, data || '');
    }
  }

  static debug(message: string, data?: any) {
    if (Environment.DEBUG.SHOW_LOGS) {
      console.debug(`🔍 ${message}`, data || '');
    }
  }

  static success(message: string, data?: any) {
    if (Environment.DEBUG.SHOW_LOGS) {
      console.log(`✅ ${message}`, data || '');
    }
  }
}
