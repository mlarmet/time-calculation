import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import tde from "assets/locales/de/translation.json";
import ten from "assets/locales/en/translation.json";
import tes from "assets/locales/es/translation.json";
import tfr from "assets/locales/fr/translation.json";

const browserLanguage = navigator.language.split("-")[0]; // fr-FR -> fr
const selectedLanguage = localStorage.getItem("lang") || browserLanguage;

i18n.use(initReactI18next).init({
	lng: selectedLanguage,
	fallbackLng: "en",
	keySeparator: ".",
	supportedLngs: ["de", "en", "es", "fr"],
	interpolation: {
		escapeValue: false,
	},
	debug: false,
	resources: {
		en: {
			translation: ten,
		},
		es: {
			translation: tes,
		},
		fr: {
			translation: tfr,
		},
		de: {
			translation: tde,
		},
	},
});

export default i18n;
