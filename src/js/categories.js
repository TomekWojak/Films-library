import { createBrowsePage, getData, showErrorPopup } from "./components.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const container = document.querySelector(".container");

	const checkAuthorization = () => {
		const userData = getData();

		if (!userData) showErrorPopup(`An unexpected error occured`, "#dc4a34");

		const isLoggedIn = userData?.loggedIn;
		const translations = userData?.translations;

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
            container.append(createBrowsePage(translations))
		}
	};
	checkAuthorization();
});
