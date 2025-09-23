import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthResponse, LoginRequest, User } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ credentials: LoginRequest; rememberMe: boolean }>(),
    'Login Success': props<{ response: AuthResponse; rememberMe: boolean }>(),
    'Login Failure': props<{ error: unknown }>(),

    'Logout': emptyProps(),
    'Load User From Storage': emptyProps(),
    'Set User': props<{ user: User | null }>(),
  },
});


