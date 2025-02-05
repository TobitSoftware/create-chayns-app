import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from './counter/slice';

const rootReducer = combineReducers({
    counter: counterReducer,
});

export const createStore = (preloadedState) => configureStore({
    reducer: rootReducer,
    preloadedState,
});

const store = createStore();

export default store;
