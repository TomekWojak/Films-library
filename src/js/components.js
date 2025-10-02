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
