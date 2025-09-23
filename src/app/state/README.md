# NgRx Feature Store Pattern

This project uses a feature-based approach for NgRx store management to keep the app configuration clean and scalable.

## Structure

Each feature has its own directory under `src/app/state/` with the following files:

```
src/app/state/[feature]/
├── [feature].actions.ts     # Action creators
├── [feature].reducer.ts      # Reducer and feature definition
├── [feature].selectors.ts    # Selectors
├── [feature].effects.ts      # Side effects
└── [feature].config.ts       # Feature provider configuration
```

## Adding a New Feature

1. **Create the feature directory structure:**
   ```bash
   mkdir src/app/state/[feature-name]
   ```

2. **Create the required files:**
   - `[feature-name].actions.ts` - Define actions
   - `[feature-name].reducer.ts` - Define state and reducer
   - `[feature-name].selectors.ts` - Define selectors
   - `[feature-name].effects.ts` - Define effects
   - `[feature-name].config.ts` - Feature provider

3. **Add to app.config.ts:**
   ```typescript
   import { provide[FeatureName]Feature } from './state/[feature-name]/[feature-name].config';
   
   export const appConfig: ApplicationConfig = {
     providers: [
       // ... other providers
       ...provide[FeatureName]Feature(),
     ]
   };
   ```

## Example: Adding Auctions Feature

1. Create `src/app/state/auctions/auctions.config.ts`:
   ```typescript
   import { provideState } from '@ngrx/store';
   import { provideEffects } from '@ngrx/effects';
   import { auctionsFeature } from './auctions.reducer';
   import { AuctionsEffects } from './auctions.effects';

   export const provideAuctionsFeature = () => [
     provideState(auctionsFeature),
     provideEffects([AuctionsEffects])
   ];
   ```

2. Add to `app.config.ts`:
   ```typescript
   import { provideAuctionsFeature } from './state/auctions/auctions.config';
   
   export const appConfig: ApplicationConfig = {
     providers: [
       // ... other providers
       ...provideAuctionsFeature(),
     ]
   };
   ```

## Benefits

- **Clean app.config.ts**: Only imports feature configs, not individual files
- **Self-contained features**: Each feature manages its own NgRx dependencies
- **Easy to add/remove**: Simply add/remove the feature config import
- **Scalable**: Works well as the application grows
- **Consistent pattern**: All features follow the same structure

## Current Features

- ✅ **Auth** - User authentication and session management
- 📝 **Auctions** - Auction management (template ready)
- 📝 **Bids** - Bidding functionality (template ready)
- 📝 **Payments** - Payment processing (template ready)
