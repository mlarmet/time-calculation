import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Option, Select } from "@mui/joy";

import "./LanguageSwitch.css";

export default function LanguageSwitch() {
	const { t, i18n } = useTranslation();

	const [value, setValue] = useState<string>(i18n.language);

	const onChange = (value: string) => {
		i18n.changeLanguage(value);

		setValue(value);

		localStorage.setItem("lang", value);
	};

	return (
		<Select
			placeholder={t("lang.placeholder")}
			defaultValue={value}
			onChange={(_e, v) => {
				if (v) {
					onChange(v as string);
				}
			}}
		>
			{Object.keys(i18n.options.resources || {})
				.sort()
				.map((lang) => (
					<Option key={lang} value={lang}>
						{t(`lang.${lang}`)}
					</Option>
				))}
		</Select>
	);
}
