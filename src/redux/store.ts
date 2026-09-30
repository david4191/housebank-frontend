import { configureStore } from '@reduxjs/toolkit';
import { houseBankApi } from './housebank.ts';

export const store = configureStore({
  reducer: {
    [houseBankApi.reducerPath]: houseBankApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      houseBankApi.middleware
    ),
});
