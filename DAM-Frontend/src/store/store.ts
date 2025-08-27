import { configureStore } from '@reduxjs/toolkit'
import assetReducer from './slices/assetSlice'
import uploadReducer from './slices/uploadSlice'

export const store = configureStore({
  reducer: {
    assets: assetReducer,
    upload: uploadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // No need to ignore actions since we're not storing File objects anymore
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
