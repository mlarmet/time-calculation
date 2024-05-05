import { configureStore } from "@reduxjs/toolkit";

import DaySlice from "src/components/Day/Day.slice";

const store = configureStore({
	reducer: {
		day: DaySlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
