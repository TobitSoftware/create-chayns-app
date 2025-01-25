import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: 0 };

const slice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment(state) {
            state.value++;
        },
        decrement(state) {
            state.value--;
        },
        incrementByAmount(state, { payload }) {
            state.value += payload;
        },
    },
    selectors: {
        selectCounterState: (state) => state,
        selectCounterValue: (state) => state.value,
    },
});

export const { increment, decrement, incrementByAmount } = slice.actions;
export const { selectCounterState, selectCounterValue } = slice.selectors;
export const counterReducer = slice.reducer;
export const counterSliceName = slice.name;
