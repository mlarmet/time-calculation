import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";

import Actions from "components/Actions/Actions";
import Day from "components/Day/Day";
import Header from "components/Header/Header";

import { DisplayAlert } from "components/Actions/Actions.type";
import { daysOfWeek, validateData } from "components/Day/Day.data";
import { getAllDays, setData } from "components/Day/Day.slice";

import { Button, ButtonGroup, ColorPaletteProp, DialogContent, DialogTitle, Divider, Modal, ModalClose, ModalDialog, Snackbar, Typography } from "@mui/joy";

import { IoIosClose as CloseIcon, IoIosClipboard, IoIosCloudUpload, IoIosCopy, IoIosMail, IoIosSave } from "react-icons/io";
import { IoAlertCircleOutline as ErrorIcon, IoCheckmarkCircleOutline as SuccessIcon } from "react-icons/io5";

import "./Home.css";

export default function Home() {
	const [totalTime, setTotalTime] = useState<number>(0);
	const [showExport, setShowExport] = useState<boolean>(false);
	const [showLoad, setShowLoad] = useState<boolean>(false);
	const [displayAlert, setDisplayAlert] = useState<DisplayAlert>({ color: "neutral", content: "", open: false });

	// Memorize the Header component to prevent re-renders
	// when dayData changes if not necessary
	const HeaderMemo = () => useMemo(() => <Header />, []);

	const { t } = useTranslation();

	const dispatch = useDispatch();

	const dayData = useSelector(getAllDays);

	const showExportModal = () => {
		setShowExport(true);
		setShowLoad(false);
	};

	const showLoadModal = () => {
		setShowLoad(true);
		setShowExport(false);
	};

	const hideModal = () => {
		setShowExport(false);
		setShowLoad(false);
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

	const getTotalTimeString = () => {
		const hours = Math.floor(totalTime / 60);
		const minutes = totalTime % 60;

		return `${hours.toString().padStart(2, "0")}h${minutes.toString().padStart(2, "0")}`;
	};

	const saveFile = () => {
		const blob = new Blob([JSON.stringify(dayData)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "time-calculation-" + moment().format("DD-MM-YYYY") + ".json";
		a.click();

		// Clean up
		URL.revokeObjectURL(url);
		a.remove();
	};

	const sendMail = () => {
		//%0D%0A = \n
		const subject = t("main.actions.export.methods.mail.subject");
		const body = t("main.actions.export.methods.mail.body") + "%0D%0A%0D%0A" + encodeURIComponent(JSON.stringify(dayData));
		const mailTo = `mailto:?subject=${subject}&body=${body}`;

		window.location.href = mailTo;
	};

	const handleShare = async (method: string) => {
		try {
			if (method === "file") {
				saveFile();
			} else if (method === "clipboard") {
				const res = await new Promise((resolve) => {
					navigator.clipboard
						.writeText(JSON.stringify(dayData))
						.then(() => {
							resolve(true);
						})
						.catch(() => {
							resolve(false);
						});
				});

				if (!res) {
					throw new Error("Error while copying to clipboard");
				}
			} else if (method === "mail") {
				sendMail();
			} else {
				throw new Error("Invalid method");
			}

			showSuccessAlert(t("main.actions.export.alert.success"));
		} catch (error) {
			showErrorAlert(t("main.actions.export.alert.error"));
		}
	};

	const loadFile = () => {
		return new Promise((resolve) => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = ".json";

			input.oncancel = () => {
				resolve(false);
			};

			input.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];

				if (!file) {
					resolve(false);
					return;
				}

				const reader = new FileReader();
				reader.readAsText(file);

				reader.onload = (e) => {
					const content = e.target?.result as string;

					try {
						const data = JSON.parse(content);
						validateData(data);
						dispatch(setData(data));
						resolve(true);
					} catch (error) {
						resolve(false);
					} finally {
						// clean up
						input.remove();
					}
				};

				reader.onerror = () => {
					resolve(false);
				};
			};

			input.click();
		});
	};

	const handleLoad = async (method: string) => {
		try {
			if (method === "file") {
				const res = await loadFile();

				if (!res) {
					throw new Error("Error while loading file");
				}
			} else if (method == "clipboard") {
				const clipboardData = await navigator.clipboard.readText();
				const data = JSON.parse(clipboardData);

				validateData(data);
				dispatch(setData(data));
			} else {
				throw new Error("Invalid method");
			}

			showSuccessAlert(t("main.actions.load.alert.success"));
		} catch (error) {
			showErrorAlert(t("main.actions.load.alert.error"));
		}
	};

	useEffect(() => {
		let total = 0;

		dayData.forEach((item) => (total += item.isRemote ? 7 * 60 : item.total));

		setTotalTime(total);
	}, [dayData]);

	return (
		<>
			<div className="home">
				{HeaderMemo()}
				<main>
					<div id="day-top-container">
						<div id="day-top">
							<div id="day-top-left">
								<h2>{getTotalTimeString()}</h2>
								<ButtonGroup variant="outlined" color="neutral">
									<Button onClick={showExportModal}>{t("main.actions.export.btn-text")}</Button>
									<Button onClick={showLoadModal}>{t("main.actions.load.btn-text")}</Button>
								</ButtonGroup>
							</div>
							<Actions />
						</div>
					</div>

					<div id="day-container">
						{daysOfWeek.map((day, index) => {
							return <Day key={index} {...day} />;
						})}
					</div>
				</main>
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

			<Modal open={showExport || showLoad} onClose={hideModal}>
				<ModalDialog variant="plain" role="alertdialog">
					<ModalClose />
					<DialogTitle>{t("main.actions." + (showExport ? "export" : "load") + ".title")}</DialogTitle>
					<Divider />
					<DialogContent>
						<Typography>{t("main.actions." + (showExport ? "export" : "load") + ".text")} :</Typography>

						<div id="share-content">
							{showExport ? (
								<>
									<Button
										onClick={() => handleShare("file")}
										variant="outlined"
										color="neutral"
										startDecorator={
											<IconContext.Provider value={{ size: "1.5em" }}>
												<IoIosSave />
											</IconContext.Provider>
										}
									>
										{t("main.actions.export.methods.file")}
									</Button>
									<Button
										onClick={() => handleShare("clipboard")}
										variant="outlined"
										color="neutral"
										startDecorator={
											<IconContext.Provider value={{ size: "1.5em" }}>
												<IoIosCopy />
											</IconContext.Provider>
										}
									>
										{t("main.actions.export.methods.clipboard")}
									</Button>
									<Button
										onClick={() => handleShare("mail")}
										variant="outlined"
										color="neutral"
										startDecorator={
											<IconContext.Provider value={{ size: "1.5em" }}>
												<IoIosMail />
											</IconContext.Provider>
										}
									>
										{t("main.actions.export.methods.mail.text")}
									</Button>
								</>
							) : (
								<>
									<Button
										onClick={() => handleLoad("file")}
										variant="outlined"
										color="neutral"
										startDecorator={
											<IconContext.Provider value={{ size: "1.5em" }}>
												<IoIosCloudUpload />
											</IconContext.Provider>
										}
									>
										{t("main.actions.load.methods.file")}
									</Button>
									<Button
										onClick={() => handleLoad("clipboard")}
										variant="outlined"
										color="neutral"
										startDecorator={
											<IconContext.Provider value={{ size: "1.5em" }}>
												<IoIosClipboard />
											</IconContext.Provider>
										}
									>
										{t("main.actions.load.methods.clipboard")}
									</Button>
								</>
							)}
						</div>
					</DialogContent>
				</ModalDialog>
			</Modal>
		</>
	);
}
