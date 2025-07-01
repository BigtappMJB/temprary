import { configureStore } from '@reduxjs/toolkit';
import applicationSlice from '../slices/slice'; // Import your slice reducer

const store = configureStore({
  reducer: {
    applicationState: applicationSlice,
    // Add other reducers here if needed
  },
  // Optional: Add Redux DevTools Extension support
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
