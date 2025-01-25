import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from './counter/slice';

const rootReducer = combineReducers({
    counter: counterReducer,
});

const Store = configureStore({
    reducer: rootReducer,
});
export default Store;
