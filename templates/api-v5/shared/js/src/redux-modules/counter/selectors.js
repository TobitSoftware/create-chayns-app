import { counterSliceName } from './slice';

export const selectCounterState = (state) => state[counterSliceName];

export const selectCounterValue = (state) => selectCounterState(state).value;
