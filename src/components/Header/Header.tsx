import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconContext } from "react-icons";

import LanguageSwitchtch from "components/LanguageSwitch/LanguageSwitch";
import ThemeSwitch from "components/ThemeSwitch/ThemeSwitch";

import { DialogTitle, Divider, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";

import { IoIosSettings as SettingsIcon } from "react-icons/io";
// import { IoAlertCircleOutline as ErrorIcon, IoCheckmarkCircleOutline as SuccessIcon } from "react-icons/io5";

import "./Header.css";

const Header = () => {
	const [showSettings, setShowSettings] = useState<boolean>(false);

	const { t } = useTranslation();

	const showModal = () => {
		setShowSettings(true);
	};

	return (
		<>
			<header>
				<h1>{__APP_NAME__}</h1>

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

			<Modal open={showSettings} onClose={() => setShowSettings(false)}>
				<ModalDialog variant="plain" role="alertdialog">
					<ModalClose />
					<DialogTitle>{t("main.actions.settings.title")}</DialogTitle>
					<Divider />
					<div id="theme" className="option">
						<Typography component="h2" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
							{t("main.actions.settings.theme")} :
						</Typography>
						<ThemeSwitch />
					</div>
					<div id="lang" className="option">
						<Typography component="h2" level="h4" textColor="inherit" fontWeight="lg" mb={2}>
							{t("main.actions.settings.lang")} :
						</Typography>
						<LanguageSwitchtch />
					</div>
				</ModalDialog>
			</Modal>
		</>
	);
};

export default Header;
