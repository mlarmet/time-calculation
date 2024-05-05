import Actions from "components/Actions/Actions";
import Day from "components/Day/Day";
import Header from "components/Header/Header";

import { daysOfWeek } from "components/Day/Day.data";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getAllDays } from "src/components/Day/Day.slice";
import "./Home.css";

export default function Home() {
	// Memoize the Header component to prevent re-renders
	// when dayData changes if not necessary
	const HeaderMemo = () => useMemo(() => <Header />, []);

	const [totalTime, setTotalTime] = useState<number>(0);

	const dayData = useSelector(getAllDays);

	const getTotalTimeString = () => {
		const hours = Math.floor(totalTime / 60);
		const minutes = totalTime % 60;

		return `${hours.toString().padStart(2, "0")}h${minutes.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		let total = 0;

		dayData.forEach((item) => (total += item.isRemote ? 7 * 60 : item.total));

		setTotalTime(total);
	}, [dayData]);

	return (
		<div className="home">
			{HeaderMemo()}
			<main>
				<div id="day-top">
					<h2>{getTotalTimeString()}</h2>
					<Actions />
				</div>

				<table id="day-container">
					<tbody>
						{daysOfWeek.map((day, index) => {
							return <Day key={index} {...day} />;
						})}
					</tbody>
				</table>
			</main>
		</div>
	);
}
