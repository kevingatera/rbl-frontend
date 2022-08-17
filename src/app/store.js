import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import artistsReducer from '../features/artists/artistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artists: artistsReducer,
  },
});
