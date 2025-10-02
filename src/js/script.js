import { createElement } from "./helpers.min.js";
import { updateElement } from "./updateStateFunctions.min.js";
import {
	createLoginPage,
	showBigLoader,
	hideBigLoader,
	createLoginHeader,
} from "./components.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const root = document.querySelector(".root");

	const container = document.querySelector(".container");

	let language = handleUserLanguage();

	const langNames = { pl: "Polski", en: "English" };

	let userData = {};

	window.translations = {};

	const langCodes = Object.keys(langNames);

	let langAmount = langCodes.length;

	function handleUserLanguage() {
		let userLang = navigator.language || navigator.userLanguage;

		if (!userLang || userLang !== "pl" || userLang !== "en") return "pl";

		userLang = userLang.slice(0, 2).toLowerCase();

		return userLang;
	}
	const getUserLanguagePreference = () => {
		const preferredLang = JSON.parse(
			localStorage.getItem("userData")
		)?.preferredLanguage;

		if (preferredLang) language = preferredLang;
	};
	getUserLanguagePreference();

	const loadFirstTranslations = async () => {
		try {
			container.append(showBigLoader());

			const response = await fetch(`./src/json/${language}.json`);
			const data = await response.json();
			translations = data;
		} catch {
			console.error("Error loading initial translation file");
		} finally {
			hideBigLoader();
		}

		// APPEND SECTION
		container.prepend(
			createLoginHeader(
				translations,
				langAmount,
				langNames,
				language,
				handleLangSelect
			)
		);
		container.append(createLoginPage(translations));
	};

	loadFirstTranslations();
	const loadTranslations = async () => {
		try {
			const response = await fetch(`./src/json/${language}.json`);

			if (!response.ok) throw new Error("Network response was not ok");

			const data = await response.json();
			translations = data;
			// UPDATE ELEMENTS
			updateElement(
				"login-header__logo",
				"aria",
				translations.header.aria.logoLink
			);
			updateElement(
				"login-header__logo-img",
				"alt",
				translations.header.alt.logo
			);
			updateElement(
				"login-header__lang-select",
				"aria",
				translations.header.aria.changeLanguageButton
			);
			updateElement("main__title", "text", translations.main.text.title);
			updateElement("main__subtitle", "text", translations.main.text.subtitle);
			updateElement("main__text", "text", translations.main.text.description);
			updateElement(
				"main__form-input--username",
				"placeholder",
				translations.main.placeholder.username
			);
			updateElement(
				"main__form-input--password",
				"placeholder",
				translations.main.placeholder.password
			);
			updateElement(
				"main__form-button-text",
				"text",
				translations.main.text.button
			);
			updateElement(
				"main__form-error-txt",
				"text",
				translations.main.text.errorRequired
			);
		} catch {
			console.error("Error loading translation file");
		}
	};
	function handleLangSelect(e, langText) {
		const selectBtn = this;
		selectBtn.classList.toggle("active");
		if (e.target.matches(".login-header__lang-choice")) {
			const selectedLang = e.target.dataset.lang;
			langText.textContent = langNames[selectedLang];
			language = selectedLang;

			loadTranslations(language);
			setUserLanguagePreference("preferredLanguage", language);
		}
	}

	const setUserLanguagePreference = (option, value) => {
		const currentUserData = JSON.parse(localStorage.getItem("userData")) || {};
		currentUserData[option] = value;
		userData = { ...userData, ...currentUserData };
		localStorage.setItem("userData", JSON.stringify(userData));
	};
});
