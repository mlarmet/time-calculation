import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import moment from "moment";

import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

import { defaultTimeSettings, remoteTimeSettings } from "components/Day/Day.data";
import { getDay } from "components/Day/Day.slice";

import "./DayInput.css";

import { DayInputProps } from "./DayInput.types";

const DayInput: React.FC<DayInputProps> = ({ section, dayName, onChange, onInput }) => {
	const [time, setTime] = useState<string>("00:00");

	const [minTime, setMinTime] = useState<string>("00:00");
	const [maxTime, setMaxTime] = useState<string>("23:59");

	const { t } = useTranslation();

	const dayData = useSelector(getDay(dayName));

	const handleChange = (value: moment.Moment | null) => {
		if (value) {
			setTime(value.format("HH:mm"));
		}
	};

	const setMinMaxAndTime = () => {
		const { min, max } = defaultTimeSettings[section];

		setMinTime(min);
		setMaxTime(max);

		const time = dayData && !dayData.isRemote ? dayData.time[section] : remoteTimeSettings[section].defaultTime;

		setTime(time);
	};

	useEffect(() => {
		setMinMaxAndTime();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dayData]);

	useEffect(() => {
		onChange(section, time);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time]);

	return (
		<div className={"day-input " + section}>
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<TimePicker
					label={t(`main.time.${section}`)}
					className="time-picker"
					ampm={false}
					format="HH:mm"
					viewRenderers={{
						hours: renderTimeViewClock,
						minutes: renderTimeViewClock,
					}}
					value={time !== "00:00" ? moment(time, "HH:mm") : null}
					onChange={handleChange}
					onAccept={handleChange}
					onOpen={() => onInput(true)}
					onClose={() => onInput(false)}
					minTime={moment(minTime, "HH:mm")}
					maxTime={moment(maxTime, "HH:mm")}
					readOnly={dayData ? dayData.isRemote : false}
				/>
			</LocalizationProvider>
		</div>
	);
};

export default DayInput;
