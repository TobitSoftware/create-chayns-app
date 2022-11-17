import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from "./counter/counterSlice";

const rootReducer = combineReducers({
    todos: counterReducer
});

const Store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
