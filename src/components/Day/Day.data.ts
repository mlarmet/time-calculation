import { RemoteTimeSettings, TimeSettings } from "../DayInput/DayInput.types";
import { DailySchedule, DaySliceModel, TimeRange, TimeSection } from "./Day.types";

const remoteTime = 420;

const remoteTimeSettings: Record<TimeSection, RemoteTimeSettings> = {
	start_AM: {
		defaultTime: "07:30",
	},
	end_AM: {
		defaultTime: "11:30",
	},
	start_PM: {
		defaultTime: "14:00",
	},
	end_PM: {
		defaultTime: "17:00",
	},
};

const defaultTimeSettings: Record<TimeSection, TimeSettings> = {
	start_AM: {
		min: "07:30",
		max: "09:30",
		defaultTime: "09:00",
	},
	end_AM: {
		min: "11:30",
		max: "14:00",
		defaultTime: "11:30",
	},
	start_PM: {
		min: "11:30",
		max: "14:00",
		defaultTime: "12:00",
	},
	end_PM: {
		min: "15:30",
		max: "18:30",
		defaultTime: "17:00",
	},
};

const daysOfWeek = [
	{ dayName: "monday", isFullDay: true },
	{ dayName: "tuesday", isFullDay: true },
	{ dayName: "wednesday", isFullDay: true },
	{ dayName: "thursday", isFullDay: true },
	{ dayName: "friday", isFullDay: false },
];

const validateTimeRange = (time: TimeRange) => {
	return (
		typeof time === "object" &&
		typeof time.start_AM === "string" &&
		typeof time.end_AM === "string" &&
		typeof time.start_PM === "string" &&
		typeof time.end_PM === "string"
	);
};

/**
 * This function validates the data object from localStorage.
 * @param data Data to validate
 * @throws Error if data isn't valide
 * @returns void
 */
const validateData = (data: DailySchedule[]) => {
	if (!Array.isArray(data)) {
		throw new Error("Data isn't an array");
	}

	if (data.length !== daysOfWeek.length) {
		throw new Error("Data length isn't valid");
	}

	let availableDayNames = daysOfWeek.map((day) => day.dayName);

	for (const item of data) {
		const errorMsg = "Day '" + item.dayName + "' ";

		if (!availableDayNames.includes(item.dayName)) {
			throw new Error(errorMsg + "isn't registered or duplicated");
		}

		availableDayNames = availableDayNames.filter((day) => day !== item.dayName);

		if (typeof item.dayName !== "string") {
			throw new Error(errorMsg + ": key dayName isn't a string");
		}

		if (typeof item.isRemote !== "boolean") {
			throw new Error(errorMsg + ": key isRemote isn't a boolean");
		}

		if (!validateTimeRange(item.time)) {
			throw new Error(errorMsg + ": key time isn't valid");
		}

		if (typeof item.total !== "number") {
			throw new Error(errorMsg + ": key total isn't a number");
		}
	}
};

// Function to initialize default day items using a given time settings object
const initializeDefaultItems = (timeSettings: Record<TimeSection, TimeSettings>): DaySliceModel[] => {
	const defaultItems: DaySliceModel[] = daysOfWeek.map(({ dayName }) => ({
		dayName,
		isRemote: false,
		time: {
			start_AM: timeSettings.start_AM.defaultTime,
			end_AM: timeSettings.end_AM.defaultTime,
			start_PM: timeSettings.start_PM.defaultTime,
			end_PM: timeSettings.end_PM.defaultTime,
		},
		total: 0,
	}));
	return defaultItems;
};

let validLocalStorage: boolean = true;

const setValidLocalStorage = (value: boolean) => {
	validLocalStorage = value;
};

const getItems = (): DaySliceModel[] => {
	const items = localStorage.getItem("items");

	if (items) {
		const parsedItems: DaySliceModel[] = JSON.parse(items);

		if (parsedItems) {
			try {
				validateData(parsedItems);
				return parsedItems;
			} catch (e) {
				console.error(e);
				validLocalStorage = false;
			}
		}
	}

	return initializeDefaultItems(defaultTimeSettings);
};

const initialItems = getItems();

export { daysOfWeek, defaultTimeSettings, initialItems, remoteTime, remoteTimeSettings, setValidLocalStorage, validLocalStorage, validateData };
