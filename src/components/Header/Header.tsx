import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconContext } from "react-icons";

import LanguageSwitchtch from "components/LanguageSwitch/LanguageSwitch";
import ThemeSwitch from "components/ThemeSwitch/ThemeSwitch";

import { DialogTitle, Divider, Drawer, ModalClose, Typography } from "@mui/joy";
import { Box } from "@mui/system";

import { IoMdSettings as SettingsIcon } from "react-icons/io";

import "./Header.css";

export default function Header() {
	const [showSettings, setShowSettings] = useState<boolean>(false);

	const { t } = useTranslation();

	const showModal = () => {
		setShowSettings(true);
	};

	return (
		<>
			<header>
				<div id="app-name">
					<h1>{__APP_NAME__}</h1>
					<p id="credit">
						by&nbsp;
						<a href="https://mlarmet.github.io" target="_blank" rel="noopener noreferrer">
							Maxence LARMET
						</a>
					</p>
				</div>

				<div id="settings">
					<IconContext.Provider
						value={{
							className: "close-icon",
							size: "1.5em",
							style: { cursor: "pointer" },
						}}
					>
						<SettingsIcon onClick={showModal} />
					</IconContext.Provider>
				</div>
			</header>

			<Drawer open={showSettings} anchor="right" size="md" onClose={() => setShowSettings(false)}>
				<ModalClose />
				<DialogTitle>{t("main.actions.settings.title")}</DialogTitle>
				<Divider />
				<Box p={2}>
					<div id="theme" className="option">
						<Typography component="h2" level="body-md" textColor="inherit" fontWeight="lg" mb={2}>
							{t("main.actions.settings.theme")} :
						</Typography>
						<ThemeSwitch />
					</div>
					<div id="lang" className="option">
						<Typography component="h2" level="body-md" textColor="inherit" fontWeight="lg" mb={2}>
							{t("main.actions.settings.lang")} :
						</Typography>
						<LanguageSwitchtch />
					</div>
				</Box>
			</Drawer>
		</>
	);
}
