import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getDay, setRemoteWork } from "components/Day/Day.slice";

import { Checkbox } from "@mui/joy";

import "./RemoteWork.css";
import { RemoteWorkProps } from "./RemoteWork.types";

const RemoteWork: React.FC<RemoteWorkProps> = ({ dayName }) => {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const dayData = useSelector(getDay(dayName));

	const handleRemoteWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setRemoteWork({ dayName, isRemote: e.target.checked }));
	};

	return (
		<div className="remote-work">
			<Checkbox
				sx={{ flexDirection: "row-reverse", alignItems: "center" }}
				label={t("main.remote")}
				size="sm"
				checked={dayData ? dayData.isRemote : false}
				onChange={handleRemoteWorkChange}
			/>
		</div>
	);
};

export default RemoteWork;
