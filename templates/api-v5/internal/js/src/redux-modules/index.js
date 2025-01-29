import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from './counter/slice';
import { loggerMiddleware } from './loggerMiddleware';

const rootReducer = combineReducers({
    counter: counterReducer,
});

const Store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export default Store;
