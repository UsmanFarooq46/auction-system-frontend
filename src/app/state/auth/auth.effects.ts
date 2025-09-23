import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials, rememberMe }) =>
        this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response, rememberMe })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ rememberMe }) => {
          if (rememberMe && typeof window !== 'undefined') {
            localStorage.setItem('rememberMe', 'true');
          }
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberMe');
          }
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  loadUserFromStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loadUserFromStorage),
        tap(() => {
          if (typeof window !== 'undefined') {
            const user = localStorage.getItem('currentUser');
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            
            console.log('Loading from storage:', { user, token, refreshToken });
            
            if (user && token) {
              try {
                const parsedUser = JSON.parse(user);
                console.log('Parsed user from storage:', parsedUser);
                // Dispatch setUser action which will also load tokens from localStorage
                this.store.dispatch(AuthActions.setUser({ user: parsedUser }));
              } catch (error) {
                console.error('Error parsing user from storage:', error);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
              }
            } else {
              console.log('No user or token found in storage');
            }
          }
        })
      ),
    { dispatch: false }
  );
}


