import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../../core/models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.login, (state) => ({ ...state, isLoading: true, error: null })),
    on(AuthActions.loginSuccess, (state, { response }) => ({
      ...state,
      isLoading: false,
      user: response.data.user,
      token: response.data.token,
      refreshToken: response?.data?.refreshToken,
      error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error: (typeof error === 'string' ? error : (error as any)?.message) ?? 'Login failed',
    })),
    on(AuthActions.logout, () => ({ ...initialAuthState })),
    on(AuthActions.setUser, (state, { user }) => ({ 
      ...state, 
      user,
      token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
      refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
    })),
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectAuthState,
  selectUser,
  selectIsLoading,
  selectError,
} = authFeature;


