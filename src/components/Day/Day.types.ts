export interface DayProps {
	dayName: string;
	isFullDay: boolean;
}
export type TimeSection = "start_AM" | "end_AM" | "start_PM" | "end_PM";

export interface DaySliceModel {
	dayName: string;
	isRemote: boolean;

	time: TimeRange;
	total: number;
}

export interface TimeRange {
	start_AM: string;
	end_AM: string;
	start_PM: string;
	end_PM: string;
}

export interface DailySchedule {
	dayName: string;
	isRemote: boolean;
	time: TimeRange;
	total: number;
}
