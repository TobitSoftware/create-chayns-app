import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from "./counter/counterSlice";

const rootReducer = combineReducers({
    todos: counterReducer
});

const Store = configureStore({
    reducer: rootReducer,
});
export default Store;
