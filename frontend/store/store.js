
import rootReducers from './rootReducers'
import { configureStore } from '@reduxjs/toolkit'
const store = configureStore({
    reducer: rootReducers,
    devTools: process.env.NODE_ENV !== "production",
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck: false
        })
    }
})

export default store;
