import { createElement } from "./helpers.min.js";

export const createLoginPage = ({
	main: {
		text: { title, subtitle, description, button, errorInvalid, errorRequired },
		placeholder: { username, password },
	},
}) => {
	const mainContent = createElement("main", ["main"]);
	const wrapper = createElement("div", ["wrapper"]);
	const loginTitle = createElement("h1");
	const loginTitleTop = createElement("span", ["main__title"]);
	const loginTitleBottom = createElement("span", ["main__subtitle"]);
	const loginText = createElement("p", ["main__text"]);
	const form = createElement("form", ["main__form"]);
	const usernameInput = createElement(
		"input",
		["main__form-input", "main__form-input--username"],
		{ type: "text", placeholder: "Username" }
	);
	const passwordInput = createElement(
		"input",
		["main__form-input", "main__form-input--password"],
		{ type: "password", placeholder: "Password" }
	);
	const submitBtn = createElement("button", ["main__form-button"], {
		type: "submit",
	});
	const errorTxt = createElement("p", ["main__form-error-txt"]);

	loginTitleTop.textContent = title;
	loginTitleBottom.textContent = subtitle;
	loginText.textContent = description;
	submitBtn.textContent = button;

	loginTitle.append(loginTitleTop, loginTitleBottom);
	form.append(usernameInput, passwordInput, submitBtn, errorTxt);

	wrapper.append(loginTitle, loginText, form);
	mainContent.append(wrapper);

	return mainContent;
};

export const showLoader = () => {
	const loadingArea = createElement("div", ["loading-area"]);
	loadingArea.innerHTML = `            <svg class="loader-big" viewBox="0 0 120 120" width="120" height="120">
                <defs>
                    <linearGradient id="loader-accent" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#4da8da" stop-opacity="0.8" />
                        <stop offset="70%" stop-color="#4da8da" stop-opacity="0.4" />
                        <stop offset="100%" stop-color="#4da8da" stop-opacity="0" />
                    </linearGradient>
                </defs>
                <circle class="loading-circle-big" r="35" cx="60" cy="60"></circle>
            </svg>`;
	return loadingArea;
};
export const hideLoader = () => {
	const loadingArea = document.querySelector(".loading-area");
	loadingArea?.remove();
};
