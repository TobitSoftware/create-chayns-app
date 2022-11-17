import { counterSliceName } from "./counterSlice";
import { RootState } from "../index";

export const selectCount = (state: RootState) => state[counterSliceName].value;
