import { createSelector } from '@ngrx/store';
import { selectAuthState } from './auth.reducer';

export const selectAuthUser = createSelector(selectAuthState, (state) => state.user);
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.isLoading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);


