import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconContext } from "react-icons";
import { useSelector } from "react-redux";

import { validLocalStorage } from "components/Day/Day.data";
import { getAllDays } from "components/Day/Day.slice";

import { Button, ColorPaletteProp, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalClose, ModalDialog, Snackbar } from "@mui/joy";

import { IoIosClose as CloseIcon } from "react-icons/io";
import { IoAlertCircleOutline as ErrorIcon, IoCheckmarkCircleOutline as SuccessIcon } from "react-icons/io5";

import "./Actions.css";

import { DisplayAlert } from "./Actions.type";

export default function Actions() {
	const [displayAlert, setDisplayAlert] = useState<DisplayAlert>({ color: "neutral", content: "", open: false });

	const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

	const { t } = useTranslation();

	const dayData = useSelector(getAllDays);

	const handleSaveAction = () => {
		try {
			localStorage.setItem("items", JSON.stringify(dayData));
			showSuccessAlert(t("main.actions.save.alert.success"));
		} catch (error) {
			console.error("Error while saving items to local storage", error);
			showErrorAlert(t("main.actions.save.alert.error"));
		}
	};

	const handleClearAction = () => {
		setShowConfirmDelete(true);
	};

	const clearData = () => {
		localStorage.removeItem("items");

		setShowConfirmDelete(false);
		showSuccessAlert(t("main.actions.clear.alert.success"));
	};

	const showAlert = (color: ColorPaletteProp, content: string, startDecorator?: React.ReactNode) => {
		setDisplayAlert({ open: true, color, content, startDecorator });
	};

	const showSuccessAlert = (content: string) => {
		showAlert("success", content, <SuccessIcon />);
	};

	const showErrorAlert = (content: string) => {
		showAlert("danger", content, <ErrorIcon />);
	};

	const hideAlert = () => {
		setDisplayAlert({ ...displayAlert, open: false });
	};

	useEffect(() => {
		if (!validLocalStorage) {
			showErrorAlert(t("main.actions.load.alert.error"));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div id="actions">
				<Button onClick={handleClearAction} variant="plain" color="danger">
					{t("main.actions.clear.btn-text")}
				</Button>
				<Button onClick={handleSaveAction}>{t("main.actions.save.btn-text")}</Button>
			</div>

			<Snackbar
				open={displayAlert.open}
				color={displayAlert.color}
				variant="soft"
				onClose={(_e, reason) => (reason === "timeout" ? hideAlert() : "")}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				key="save-feedback"
				startDecorator={<IconContext.Provider value={{ size: "1.5em" }}>{displayAlert.startDecorator}</IconContext.Provider>}
				endDecorator={
					<IconContext.Provider
						value={{
							className: "close-icon",
							size: "1.5em",
							style: { cursor: "pointer" },
						}}
					>
						<CloseIcon onClick={hideAlert} />
					</IconContext.Provider>
				}
			>
				<span>{displayAlert.content}</span>
			</Snackbar>

			<Modal open={showConfirmDelete} onClose={() => setShowConfirmDelete(false)}>
				<ModalDialog variant="plain" role="alertdialog">
					<ModalClose />
					<DialogTitle>{t("main.actions.clear.confirm.title")}</DialogTitle>
					<Divider />
					<DialogContent>{t("main.actions.clear.confirm.text")}</DialogContent>
					<DialogActions>
						<Button variant="solid" color="danger" onClick={clearData}>
							{t("main.actions.clear.confirm.btn-confirm")}
						</Button>
						<Button variant="plain" color="neutral" onClick={() => setShowConfirmDelete(false)}>
							{t("main.actions.clear.confirm.btn-cancel")}
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</>
	);
}
