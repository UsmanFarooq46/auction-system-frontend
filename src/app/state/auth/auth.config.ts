import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authFeature } from './auth.reducer';
import { AuthEffects } from './auth.effects';

/**
 * Provides all NgRx dependencies for the Auth feature
 * @returns Array of providers for auth state management
 */
export const provideAuthFeature = () => [
  provideState(authFeature),
  provideEffects([AuthEffects])
];
