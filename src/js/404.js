import {
	getData,
	showErrorPopup,
	createBrowsePage,
	closeAllNotClicked,
} from "./components.min.js";
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

	const createErrorSection = ({ page404: { errorTxt } }) => {
		const main = createElement("main", ["container__not-found-main"]);
		const text = createElement("p", ["container__not-found-text"]);
		text.textContent = errorTxt;

		main.append(text);

		return main;
	};

	container.append(
		createBrowsePage(translations),
		createErrorSection(translations)
	);

	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
});
