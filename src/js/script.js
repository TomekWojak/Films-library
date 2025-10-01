import { createElement } from "./helpers.js";

document.addEventListener("DOMContentLoaded", function () {
	const root = document.querySelector(".root");
	const container = document.querySelector(".container");

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
        langPlatformLang.textContent = "Polski";

        // end of language selector
	};
});
