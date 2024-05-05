import { useEffect, useState } from "react";

import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

import { Button, ToggleButtonGroup } from "@mui/joy";

import { Mode } from "@mui/system/cssVars/useCurrentColorScheme";

import { useTranslation } from "react-i18next";
import "./ThemeSwitch.css";

const ThemeSwitch = () => {
	const [value, setValue] = useState<string>("system");

	const { systemMode: muiSystemMode, setMode: setMaterialMode } = useMaterialColorScheme();
	const { systemMode: joySystemMode, setMode: setJoyMode } = useJoyColorScheme();

	const { t } = useTranslation();

	const onChange = (value: string) => {
		const selectedMode = value as Mode;

		setValue(selectedMode);

		setMaterialMode(selectedMode);
		setJoyMode(selectedMode);

		localStorage.setItem("theme", selectedMode);

		let theme = selectedMode;
		if (selectedMode === "system") {
			theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		}

		const possibleThemes: Mode[] = ["dark", "light", "system"];
		document.body.classList.remove(...possibleThemes);

		document.body.classList.add(theme);
	};

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");

		onChange(savedTheme || "system");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// Refresh theme if system theme change
		// only if theme mode is on system
		if (value === "system" && muiSystemMode && joySystemMode) {
			onChange("system");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [muiSystemMode, joySystemMode]);

	return (
		<div className="theme-switch">
			<ToggleButtonGroup
				size="lg"
				color="primary"
				variant="outlined"
				value={value}
				onChange={(_e, v) => {
					if (v) {
						onChange(v);
					}
				}}
			>
				<Button value="light" title={t("theme.light")}>
					🌞
				</Button>
				<Button value="dark" title={t("theme.dark")}>
					🌒
				</Button>
				<Button value="system" title={t("theme.system")}>
					⚙️
				</Button>
			</ToggleButtonGroup>
		</div>
	);
};

export default ThemeSwitch;
