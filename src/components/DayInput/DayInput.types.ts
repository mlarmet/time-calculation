import { TimeSection } from "components/Day/Day.types";

export interface DayInputProps {
	section: TimeSection;
	dayName: string;
	onChange: (section: TimeSection, time: string) => void;
	onInput: (isOpened: boolean) => void;
}

export interface TimeSettings {
	min: string;
	max: string;
	defaultTime: string;
}

export interface RemoteTimeSettings {
	defaultTime: string;
}
