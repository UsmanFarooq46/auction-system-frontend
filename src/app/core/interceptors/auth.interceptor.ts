import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Attach Authorization header if token exists
  let modifiedReq = req;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      modifiedReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  } catch {
    // ignore storage access errors (e.g., SSR)
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Normalize backend error shape: { success: boolean, message: string }
      let message = 'An unexpected error occurred';
      if (error.error) {
        if (typeof error.error === 'object' && 'message' in error.error) {
          message = (error.error as { message?: string }).message || message;
        } else if (typeof error.error === 'string') {
          message = error.error;
        }
      } else if (error.message) {
        message = error.message;
      }

      return throwError(() => new Error(message));
    })
  );
};
