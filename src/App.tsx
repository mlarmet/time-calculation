import { Provider } from "react-redux";
import store from "services/store";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
	THEME_ID as MATERIAL_THEME_ID,
	Experimental_CssVarsProvider as MaterialCssVarsProvider,
	experimental_extendTheme as materialExtendTheme,
} from "@mui/material/styles";

import Home from "views/Home/Home.tsx";

import { useEffect } from "react";
import "services/i18n";

export default function App() {
	const materialTheme = materialExtendTheme();

	useEffect(() => {
		document.title = __APP_NAME__;
	}, []);

	return (
		<MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
			<JoyCssVarsProvider>
				<Provider store={store}>
					<Home />
				</Provider>
			</JoyCssVarsProvider>
		</MaterialCssVarsProvider>
	);
}
