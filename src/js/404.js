import { getData, showErrorPopup, createBrowsePage } from "./components.min.js";
import { createElement } from "./helpers.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const container = document.querySelector(".container");
	const userData = getData();

	if (!userData) {
		showErrorPopup(`An unexpected error occured`, "#dc4a34");
		setTimeout(() => {
			window.location.href = "/";
		}, 3000);
		return;
	}

	const translations = userData?.translations;

	const createErrorTxt = ({ page404: { errorTxt } }) => {
		const text = createElement("p", ["container__not-found-text"]);
		text.textContent = errorTxt;

		return text;
	};

	container.append(
		createBrowsePage(translations),
		createErrorTxt(translations)
	);
});
