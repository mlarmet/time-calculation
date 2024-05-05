import LanguageSwitchtch from "components/LanguageSwitch/LanguageSwitch";
import ThemeSwitch from "components/ThemeSwitch/ThemeSwitch";

import "./Header.css";

const Header = () => {
	return (
		<header>
			<h1>{__APP_NAME__}</h1>

			<div id="settings">
				<ThemeSwitch />
				<LanguageSwitchtch />
			</div>
		</header>
	);
};

export default Header;
