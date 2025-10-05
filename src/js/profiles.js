import { createProfilesPage, getData } from "./components.min.js";
document.addEventListener("DOMContentLoaded", function () {
	const checkAuthorization = () => {
		const userData = getData();
		const isLoggedIn = userData?.loggedIn;
		const translations = userData?.translations;

		if (!userData || !isLoggedIn) {
			window.location.href = "/";
		} else {
			createProfilesPage(translations);
		}
	};
	checkAuthorization();
});
