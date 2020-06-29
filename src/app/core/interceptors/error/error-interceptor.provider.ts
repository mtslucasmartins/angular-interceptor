import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './error.interceptor';

export const GlobalErrorHandlerProvider = {
  provide: ErrorHandler,
  useClass: GlobalErrorHandler
}
