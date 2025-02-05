import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from './counter/slice';
import { loggerMiddleware } from './loggerMiddleware';

const rootReducer = combineReducers({
    counter: counterReducer,
});

export const createStore = (preloadedState?: RootState) => configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
    preloadedState,
});

const store = createStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];

export default store;
