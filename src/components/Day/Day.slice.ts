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
			const items = state.items.map((item) => {
				if (item.dayName === action.payload.dayName) {
					return action.payload.dayData;
				}
				return item;
			});

			state.items = items;
		},

		setRemoteWork: (state, action) => {
			const items = state.items.map((item) => {
				if (item.dayName === action.payload.dayName) {
					return { ...item, isRemote: action.payload.isRemote };
				}
				return item;
			});

			state.items = items;
		},
	},
});

export const { setDayInput, setRemoteWork } = DayInputSlice.actions;

export const getAllDays = (state: RootState) => state.day.items;

export const getDay = (dayName: string) => (state: RootState) => state.day.items.find((item) => item.dayName === dayName);

export default DayInputSlice.reducer;
