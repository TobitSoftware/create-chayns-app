import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createReduxErrorLoggerMiddleware } from 'chayns-logger';
import logger from '../utils/logger';
import { counterReducer } from './counter/slice';

const rootReducer = combineReducers({
    counter: counterReducer,
});

export const createStore = (preloadedState?: RootState) =>
    configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createReduxErrorLoggerMiddleware(logger)),
        preloadedState,
    });

const store = createStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];

export default store;
