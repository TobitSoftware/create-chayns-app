import { counterSliceName } from './counterSlice';

export const selectCount = (state) => state[counterSliceName].value;
