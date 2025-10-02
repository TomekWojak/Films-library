import { createElement } from "./helpers.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const root = document.querySelector(".root");
	const container = document.querySelector(".container");
	let language = handleUserLanguage();
	const langNames = { pl: "Polski", en: "English" };
	let userData = {};
	let translations = {};
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

	const loadTranslations = async (lang) => {
		try {
			const response = await fetch(`./src/json/${lang}.json`);

			if (!response.ok) throw new Error("Network response was not ok");

			const data = await response.json();
			translations = data;
			console.log(translations);
		} catch {
			console.error("Error loading translation file");
		}
	};
	loadTranslations(language);

	const createLoginHeader = () => {
		// logo
		const header = createElement("header", ["header"]);
		const logo = createElement("a", ["header__logo", "login-header__logo"], {
			href: "/",
			"aria-label": "Stream - Strona główna",
		});
		const logoImg = createElement(
			"img",
			["header__logo-img", "login-header__logo-img"],
			{
				src: "./src/icons/logo.svg",
				alt: "Logo platformy Stream - jedynej takiej platformy streamingowej",
				width: "24",
				height: "24",
			}
		);
		const logoText = createElement("span", [
			"header__logo-text",
			"login-header__logo-text",
		]);
		logoText.textContent = "Stream";
		logo.append(logoImg, logoText);
		header.append(logo);
		// end of logo

		// language selector
		const langSelect = createElement("button", ["login-header__lang-select"], {
			"aria-label": "Wybierz język platformy Stream",
		});
		const langPlatformLang = createElement("span", [
			"login-header__lang-platform-lang",
		]);
		const langArrow = createElement("img", ["login-header__lang-arrow"], {
			src: "./src/icons/chevron-down.svg",
			alt: "",
			width: "24",
			height: "24",
		});
		const langList = createElement("ul", ["login-header__lang-list"]);

		for (let i = 0; i < langAmount; i++) {
			const langChoice = createElement("li", ["login-header__lang-choice"]);
			const data = Object.keys(langNames)[i];
			const text = Object.values(langNames)[i];

			langChoice.dataset.lang = data;
			langChoice.textContent = text;
			langChoice.style.animationDelay = i * 100 + "ms";
			langList.append(langChoice);
		}

		langPlatformLang.textContent = langNames[language];

		langSelect.addEventListener("click", (e) => {
			handleLangSelect.call(langSelect, e, langPlatformLang);
		});

		langSelect.append(langPlatformLang, langArrow, langList);
		header.append(langSelect);

		return header;
		// end of language selector
	};

	function handleLangSelect(e, langText) {
		const selectBtn = this;
		selectBtn.classList.toggle("active");

		if (e.target.matches(".login-header__lang-choice")) {
			const selectedLang = e.target.dataset.lang;
			langText.textContent = langNames[selectedLang];
			language = selectedLang;

			setUserLanguagePreference("preferredLanguage", language);
			loadTranslations(language);
		}
	}
	const setUserLanguagePreference = (option, value) => {
		const currentUserData = JSON.parse(localStorage.getItem("userData")) || {};
		currentUserData[option] = value;
		userData = { ...userData, ...currentUserData };
		localStorage.setItem("userData", JSON.stringify(userData));
	};

	container.append(createLoginHeader());
});
