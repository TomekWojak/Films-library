import {
	getData,
	createBrowsePage,
	showErrorPopup,
	showBigLoader,
	hideBigLoader,
	createFooter,
	closeAllNotClicked,
	createExploreHeroSection,
	createSpecifiedSectionPoster,
} from "./components.min.js";

document.addEventListener("DOMContentLoaded", function () {
	const checkAuthorization = async () => {
		const userData = getData();
		const translations = userData?.translations;
		const currentLanguage = userData?.preferredLanguage;
		const isLoggedIn = userData?.loggedIn;
		const container = document.querySelector(".container");
		const currentProfile = userData?.currentProfile;

		if (!userData || !isLoggedIn || !currentProfile) {
			window.location.href = "/";
			return;
		}

		try {
			container.append(createBrowsePage(translations));

			container.append(showBigLoader());
			container.append(createFooter(translations));
		} catch {
			showErrorPopup(translations.browsePage.loadingDataError, "#dc4a34");
		} finally {
			hideBigLoader();
		}
	};

	const getFilmsOrSeries = async () => {
		const category = window.location.href;

		if (category.includes("movies.html")) {
			// wyrenderuj filmy
			return;
		}
		if (category.includes("series.html")) {
			// wyrenderuj seriale
			return;
		}
		if (category.includes("my-list.html")) {
			// wyrenderuj moja lista{
			return;
		}
		if (category.includes("search.html")) {
			// wyrenderuj search
			return;
		}

		window.location.href = "404.html";
	};
	getFilmsOrSeries();

	checkAuthorization();
	window.addEventListener("click", (e) => {
		closeAllNotClicked(e);
	});
});
