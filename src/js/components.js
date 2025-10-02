import { createElement } from "./helpers.min.js";

const USERNAME = "handsomeUser404";
const PASSWORD = "5jksH9d.";

export const createLoginPage = ({
	main: {
		text: { title, subtitle, description, button },
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
		{ type: "text", placeholder: username }
	);
	const passwordInput = createElement(
		"input",
		["main__form-input", "main__form-input--password"],
		{ type: "password", placeholder: password }
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

	submitBtn.addEventListener("click", (e) => {
		const results =
			handleLoginValidation(
				e,
				usernameInput,
				passwordInput,
				translations.main.text.errorRequired,
				translations.main.text.errorInvalid,
				USERNAME,
				PASSWORD
			) ?? "";

		errorTxt.classList.add("visible");
		errorTxt.textContent = results;

		if (!results) {
			errorTxt.classList.remove("visible");
		}
	});

	return mainContent;
};

const handleLoginValidation = (
	e,
	usernameInput,
	passwordInput,
	requireError,
	invalidError,
	username,
	password
) => {
	e.preventDefault();

	if (usernameInput.value.trim() === "" || passwordInput.value.trim() === "") {
		return requireError;
	} else if (
		usernameInput.value.trim() !== username ||
		passwordInput.value.trim() !== password
	) {
		return invalidError;
	} else {
		return null;
	}
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
