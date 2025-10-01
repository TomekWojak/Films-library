import { createElement } from "./helpers.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const root = document.querySelector(".root");
	const container = document.querySelector(".container");
	let language = handleUserLanguage();
	const langNames = { pl: "Polski", en: "English" };
	function handleUserLanguage() {
		let userLang = navigator.language || navigator.userLanguage;

		if (!userLang || userLang !== "pl" || userLang !== "en") return "pl";

		userLang = userLang.slice(0, 2).toLowerCase();

		return userLang;
	}

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
				src: "./icons/logo.svg",
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
			src: "./icons/chevron-down.svg",
			alt: "",
			width: "24",
			height: "24",
		});
		const langList = createElement("ul", ["login-header__lang-list"]);
		const langChoiceEn = createElement("li", ["login-header__lang-choice"], {
			"data-lang": "en",
		});
		const langChoicePl = createElement("li", ["login-header__lang-choice"], {
			"data-lang": "pl",
		});

		langChoiceEn.textContent = "English";
		langChoicePl.textContent = "Polski";
		langPlatformLang.textContent = langNames[language];

		langSelect.addEventListener("click", (e) => {
			handleLangSelect.call(langSelect, e, langPlatformLang);
		});

		langList.append(langChoiceEn, langChoicePl);
		langSelect.append(langPlatformLang, langArrow, langList);
		header.append(langSelect);

		return header;
		// end of language selector
	};

	function handleLangSelect(e, langText) {
		const selectBtn = this;
		selectBtn.classList.toggle("active");

		if (e.target.matches(".login-header__lang-choice")) {
			const selectedLang = e.target.dataset?.lang;
			langText.textContent = langNames[selectedLang];
			language = selectedLang;
			setUserLanguagePreference(language);
		}
	}
	const setUserLanguagePreference = (lang) => {
		localStorage.setItem("preferredLanguage", lang);
		console.log(language);
	};

	container.append(createLoginHeader());
});
