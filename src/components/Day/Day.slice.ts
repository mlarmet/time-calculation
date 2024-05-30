import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "services/store";

import { initialItems } from "./Day.data";
import { DaySliceModel } from "./Day.types";

const initialState: { items: DaySliceModel[] } = {
	items: initialItems,
};

export const DayInputSlice = createSlice({
	name: "day",
	initialState,

	reducers: {
		setDayInput: (state, action) => {
			const index = state.items.findIndex((item) => item.dayName === action.payload.dayName);

			if (index !== -1) {
				state.items[index] = action.payload.dayData;
			}
		},

		setRemoteWork: (state, action) => {
			const index = state.items.findIndex((item) => item.dayName === action.payload.dayName);

			if (index !== -1) {
				state.items[index].isRemote = action.payload.isRemote;
			}
		},
	},
});

export const { setDayInput, setRemoteWork } = DayInputSlice.actions;

export const getAllDays = (state: RootState) => state.day.items;

export const getDay = (dayName: string) => (state: RootState) => state.day.items.find((item) => item.dayName === dayName);

export default DayInputSlice.reducer;
