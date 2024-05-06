import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import DayInput from "components/DayInput/DayInput";
import RemoteWork from "components/RemoteWork/RemoteWork";

import "./Day.css";

import { remoteTime } from "./Day.data";
import { getDay, setDayInput } from "./Day.slice";
import { DayProps, TimeSection } from "./Day.types";

const Day: React.FC<DayProps> = ({ dayName, isFullDay }) => {
	const [selected, setSelected] = useState<boolean>(false);

	const { t } = useTranslation();

	const dispatch = useDispatch();

	const dayData = useSelector(getDay(dayName));

	const parseTimeToData = (timeStr: string): Date => {
		const [hours, minutes] = timeStr.split(":").map(Number);

		const date = new Date();
		date.setHours(hours, minutes, 0);

		return date;
	};

	const calcTimeDiff = (startTime: string, endTime: string): number => {
		const startDateTime = parseTimeToData(startTime).getTime();
		const endDateTime = parseTimeToData(endTime).getTime();

		if (endDateTime < startDateTime) {
			return 0;
		}

		return endDateTime - startDateTime;
	};

	const getTotalTimeString = () => {
		if (!dayData) {
			return "--h--";
		}

		const total = dayData.isRemote ? remoteTime : dayData.total;

		const hours = Math.floor(total / 60);
		const minutes = total % 60;

		return `${hours.toString().padStart(2, "0")}h${minutes.toString().padStart(2, "0")}`;
	};

	const handleTimeInput = (isOpened: boolean) => {
		setSelected(isOpened);
	};

	const handleTimeChange = (section: TimeSection, time: string) => {
		if (!dayData || dayData.isRemote) {
			return;
		}

		const dayValue = structuredClone(dayData);

		dayValue.time[section] = time;
		let timeDiff = 0;
		timeDiff += calcTimeDiff(dayValue.time.start_AM, dayValue.time.end_AM);

		if (isFullDay) {
			timeDiff += calcTimeDiff(dayValue.time.start_PM, dayValue.time.end_PM);

			const minimalBreakTime = 60 * 40 * 1000;

			const currentBreakTime = calcTimeDiff(dayValue.time.end_AM, dayValue.time.start_PM);

			if (currentBreakTime < minimalBreakTime) {
				timeDiff -= minimalBreakTime - currentBreakTime;
			}
		}

		// Convert milliseconds to hours and minutes
		const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
		const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

		dayValue.total = hoursDiff * 60 + minutesDiff;

		dispatch(setDayInput({ dayName, dayData: dayValue }));
	};

	return (
		<>
			{dayData ? (
				<tr className={`day ${dayData.dayName}` + (selected ? "  selected" : "")}>
					<td className="day-name-container">
						<h3 className="day-name">{t("days." + dayData.dayName)}</h3>
						<RemoteWork dayName={dayData.dayName} />
					</td>

					<td className="day-total-container">
						<h3>{t("main.total")}</h3>
						<p className="day-total">{getTotalTimeString()}</p>
					</td>

					<td className={"day-input-container" + (dayData && dayData.isRemote ? " is-remote" : "")}>
						<DayInput section="start_AM" dayName={dayData.dayName} onChange={handleTimeChange} onInput={handleTimeInput} />
						<span title={t("main.break.first")}>☕</span>
						<DayInput section="end_AM" dayName={dayData.dayName} onChange={handleTimeChange} onInput={handleTimeInput} />
						{
							/* Afternoon input */
							isFullDay ? (
								<>
									<span title={t("main.break.middle")}>🍽️</span>
									<DayInput section="start_PM" dayName={dayData.dayName} onChange={handleTimeChange} onInput={handleTimeInput} />
									<span title={t("main.break.last")}>🐏</span>
									{/* TODO : if hover 5s : play soundx */}
									<DayInput section="end_PM" dayName={dayData.dayName} onChange={handleTimeChange} onInput={handleTimeInput} />
								</>
							) : (
								<span title={t("main.break.end")}>🔚</span>
							)
						}
					</td>
				</tr>
			) : (
				<tr>
					<td>Loading...</td>
				</tr>
			)}
		</>
	);
};

export default Day;
