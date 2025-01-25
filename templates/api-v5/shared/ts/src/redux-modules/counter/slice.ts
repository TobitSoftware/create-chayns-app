import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: 0 };

const counterSlice = createSlice({
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

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const { selectCounterState, selectCounterValue } = counterSlice.selectors;
export const counterReducer = counterSlice.reducer;
export const counterSliceName = counterSlice.name;
